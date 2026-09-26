import { describe, it, expect, beforeEach } from "vitest";
import { AuditLogService } from "@/services/auditLogService";
import type { IAuditLogsRepository } from "@/repositories/auditLogsRepository";
import type { AuditLog } from "@/types/database";
import { DEMO_ACCOUNTS } from "@/lib/auth/rbac";

class MockAuditLogsRepository implements IAuditLogsRepository {
  public logs: AuditLog[] = [];

  async create(entry: any): Promise<AuditLog> {
    const item: AuditLog = {
      id: `mock-log-${this.logs.length + 1}`,
      user_id: entry.user_id || null,
      action: entry.action,
      entity: entry.entity,
      entity_id: entry.entity_id || null,
      timestamp: entry.timestamp || new Date().toISOString(),
      ip_address: entry.ip_address || null,
      metadata: entry.metadata || {},
    };
    this.logs.unshift(item);
    return item;
  }

  async getAll(limit = 100): Promise<AuditLog[]> {
    return this.logs.slice(0, limit);
  }

  async getByUserId(userId: string): Promise<AuditLog[]> {
    return this.logs.filter((l) => l.user_id === userId);
  }

  async getByEntity(entity: string, entityId?: string): Promise<AuditLog[]> {
    return this.logs.filter(
      (l) => l.entity === entity && (!entityId || l.entity_id === entityId)
    );
  }
}

describe("AuditLogService", () => {
  let mockRepo: MockAuditLogsRepository;
  let service: AuditLogService;
  const user = DEMO_ACCOUNTS.vice_principal.user;

  beforeEach(() => {
    mockRepo = new MockAuditLogsRepository();
    service = new AuditLogService(mockRepo);
  });

  it("should record auth login event", async () => {
    const log = await service.logAuth("auth.login", user, "192.168.1.10", {
      browser: "Chrome",
    });

    expect(log.action).toBe("auth.login");
    expect(log.entity).toBe("auth");
    expect(log.user_id).toBe(user.id);
    expect(log.ip_address).toBe("192.168.1.10");
    expect((log.metadata as any).userName).toBe(user.fullName);
    expect((log.metadata as any).browser).toBe("Chrome");
    expect(mockRepo.logs.length).toBe(1);
  });

  it("should record administrative action event", async () => {
    const log = await service.logAction({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: "record.create",
      entity: "absence",
      entityId: "absence-001",
      metadata: { reason: "مرضي" },
    });

    expect(log.action).toBe("record.create");
    expect(log.entity).toBe("absence");
    expect(log.entity_id).toBe("absence-001");
    expect((log.metadata as any).reason).toBe("مرضي");
  });

  it("should retrieve audit trail filtered by entity", async () => {
    await service.logAction({
      userId: "u1",
      action: "record.create",
      entity: "teacher",
      entityId: "t1",
    });
    await service.logAction({
      userId: "u1",
      action: "record.create",
      entity: "absence",
      entityId: "a1",
    });

    const teacherLogs = await service.getAuditTrail({ entity: "teacher" });
    expect(teacherLogs.length).toBe(1);
    expect(teacherLogs[0].entity).toBe("teacher");
    expect(teacherLogs[0].entityId).toBe("t1");
  });
});
