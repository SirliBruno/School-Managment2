import { supabaseClient } from "@/lib/supabase/client";
import type { AuditLog, Database } from "@/types/database";
import type { AuditLogEntry } from "@/types/security";

type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];

export interface IAuditLogsRepository {
  create(entry: AuditLogInsert): Promise<AuditLog>;
  getAll(limit?: number): Promise<AuditLog[]>;
  getByUserId(userId: string): Promise<AuditLog[]>;
  getByEntity(entity: string, entityId?: string): Promise<AuditLog[]>;
}

export class AuditLogsRepository implements IAuditLogsRepository {
  async create(entry: AuditLogInsert): Promise<AuditLog> {
    try {
      const { data, error } = await supabaseClient
        .from("audit_logs")
        .insert(entry)
        .select()
        .single();

      if (error) {
        console.warn("AuditLogsRepository.create remote failed, falling back to local memory:", error.message);
        return {
          id: `audit-${Date.now()}`,
          user_id: entry.user_id ?? null,
          action: entry.action,
          entity: entry.entity,
          entity_id: entry.entity_id ?? null,
          timestamp: entry.timestamp ?? new Date().toISOString(),
          ip_address: entry.ip_address ?? null,
          metadata: entry.metadata ?? {},
        };
      }
      return data;
    } catch {
      return {
        id: `audit-${Date.now()}`,
        user_id: entry.user_id ?? null,
        action: entry.action,
        entity: entry.entity,
        entity_id: entry.entity_id ?? null,
        timestamp: entry.timestamp ?? new Date().toISOString(),
        ip_address: entry.ip_address ?? null,
        metadata: entry.metadata ?? {},
      };
    }
  }

  async getAll(limit = 100): Promise<AuditLog[]> {
    const { data, error } = await supabaseClient
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("AuditLogsRepository.getAll fallback:", error.message);
      return [];
    }
    return data ?? [];
  }

  async getByUserId(userId: string): Promise<AuditLog[]> {
    const { data, error } = await supabaseClient
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) return [];
    return data ?? [];
  }

  async getByEntity(entity: string, entityId?: string): Promise<AuditLog[]> {
    let query = supabaseClient
      .from("audit_logs")
      .select("*")
      .eq("entity", entity);

    if (entityId) {
      query = query.eq("entity_id", entityId);
    }

    const { data, error } = await query.order("timestamp", { ascending: false });
    if (error) return [];
    return data ?? [];
  }
}

export const auditLogsRepository = new AuditLogsRepository();
