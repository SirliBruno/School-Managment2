import { supabaseClient } from "@/lib/supabase/client";
import type { DelayNotice, Database } from "@/types/database";

type DelayNoticeInsert = Database["public"]["Tables"]["delay_notices"]["Insert"];
type DelayNoticeUpdate = Database["public"]["Tables"]["delay_notices"]["Update"];

export interface IDelayNoticesRepository {
  getAll(): Promise<DelayNotice[]>;
  getByTeacherId(teacherId: string): Promise<DelayNotice[]>;
  getById(id: string): Promise<DelayNotice | null>;
  create(payload: DelayNoticeInsert): Promise<DelayNotice>;
  update(id: string, payload: DelayNoticeUpdate): Promise<DelayNotice>;
  delete(id: string): Promise<void>;
}

export class DelayNoticesRepository implements IDelayNoticesRepository {
  async getAll(): Promise<DelayNotice[]> {
    const { data, error } = await supabaseClient
      .from("delay_notices")
      .select("*")
      .order("delay_date", { ascending: false });

    if (error) throw new Error(`DelayNoticesRepository.getAll: ${error.message}`);
    return data ?? [];
  }

  async getByTeacherId(teacherId: string): Promise<DelayNotice[]> {
    const { data, error } = await supabaseClient
      .from("delay_notices")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("delay_date", { ascending: false });

    if (error) throw new Error(`DelayNoticesRepository.getByTeacherId: ${error.message}`);
    return data ?? [];
  }

  async getById(id: string): Promise<DelayNotice | null> {
    const { data, error } = await supabaseClient
      .from("delay_notices")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`DelayNoticesRepository.getById: ${error.message}`);
    return data;
  }

  async create(payload: DelayNoticeInsert): Promise<DelayNotice> {
    const { data, error } = await supabaseClient
      .from("delay_notices")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`DelayNoticesRepository.create: ${error.message}`);
    return data;
  }

  async update(id: string, payload: DelayNoticeUpdate): Promise<DelayNotice> {
    const { data, error } = await supabaseClient
      .from("delay_notices")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`DelayNoticesRepository.update: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("delay_notices")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`DelayNoticesRepository.delete: ${error.message}`);
  }
}

export const delayNoticesRepository = new DelayNoticesRepository();
