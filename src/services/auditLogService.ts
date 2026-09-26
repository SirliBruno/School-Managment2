import { auditLogsRepository, type IAuditLogsRepository } from "@/repositories/auditLogsRepository";
import type { AuditLog } from "@/types/database";
import type { AuditAction, AuditLogEntry, AuthUser } from "@/types/security";

export interface LogActionParams {
  userId?: string;
  userName?: string;
  userRole?: string;
  action: AuditAction;
  entity: "teacher" | "absence" | "delay" | "inquiry" | "deduction" | "auth" | "system";
  entityId?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export class AuditLogService {
  constructor(private readonly repo: IAuditLogsRepository = auditLogsRepository) {}

  /**
   * Log authentication events (login, logout, failed attempt)
   */
  async logAuth(
    action: "auth.login" | "auth.logout",
    user: AuthUser,
    ipAddress?: string,
    metadata?: Record<string, unknown>
  ): Promise<AuditLog> {
    return this.repo.create({
      user_id: user.id,
      action,
      entity: "auth",
      entity_id: user.id,
      ip_address: ipAddress || null,
      timestamp: new Date().toISOString(),
      metadata: {
        userName: user.fullName,
        role: user.role,
        schoolName: user.schoolName,
        ...metadata,
      },
    });
  }

  /**
   * Log administrative state-changing action
   */
  async logAction(params: LogActionParams): Promise<AuditLog> {
    return this.repo.create({
      user_id: params.userId || null,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId || null,
      ip_address: params.ipAddress || null,
      timestamp: new Date().toISOString(),
      metadata: {
        ...(params.userName ? { userName: params.userName } : {}),
        ...(params.userRole ? { userRole: params.userRole } : {}),
        ...(params.metadata || {}),
      },
    });
  }

  /**
   * Query recent audit logs with optional filtering
   */
  async getAuditTrail(filter?: {
    userId?: string;
    entity?: string;
    entityId?: string;
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    let logs: AuditLog[] = [];

    if (filter?.userId) {
      logs = await this.repo.getByUserId(filter.userId);
    } else if (filter?.entity) {
      logs = await this.repo.getByEntity(filter.entity, filter.entityId);
    } else {
      logs = await this.repo.getAll(filter?.limit || 100);
    }

    return logs.map((log) => ({
      id: log.id,
      userId: log.user_id || "system",
      userName: (log.metadata as Record<string, unknown>)?.userName as string | undefined,
      userRole: (log.metadata as Record<string, unknown>)?.userRole as any,
      action: log.action as AuditAction,
      entity: log.entity as any,
      entityId: log.entity_id || undefined,
      timestamp: log.timestamp,
      ipAddress: log.ip_address || undefined,
      metadata: log.metadata as Record<string, unknown>,
    }));
  }
}

export const auditLogService = new AuditLogService();
