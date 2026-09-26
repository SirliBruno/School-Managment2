import { supabaseClient } from "@/lib/supabase/client";
import type { AbsenceRecord, Database } from "@/types/database";

type AbsenceRecordInsert = Database["public"]["Tables"]["absence_records"]["Insert"];
type AbsenceRecordUpdate = Database["public"]["Tables"]["absence_records"]["Update"];

export interface IAbsenceRecordsRepository {
  getAll(): Promise<AbsenceRecord[]>;
  getByTeacherId(teacherId: string): Promise<AbsenceRecord[]>;
  getById(id: string): Promise<AbsenceRecord | null>;
  create(payload: AbsenceRecordInsert): Promise<AbsenceRecord>;
  update(id: string, payload: AbsenceRecordUpdate): Promise<AbsenceRecord>;
  delete(id: string): Promise<void>;
}

export class AbsenceRecordsRepository implements IAbsenceRecordsRepository {
  async getAll(): Promise<AbsenceRecord[]> {
    const { data, error } = await supabaseClient
      .from("absence_records")
      .select("*")
      .order("absence_date", { ascending: false });

    if (error) throw new Error(`AbsenceRecordsRepository.getAll: ${error.message}`);
    return data ?? [];
  }

  async getByTeacherId(teacherId: string): Promise<AbsenceRecord[]> {
    const { data, error } = await supabaseClient
      .from("absence_records")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("absence_date", { ascending: false });

    if (error) throw new Error(`AbsenceRecordsRepository.getByTeacherId: ${error.message}`);
    return data ?? [];
  }

  async getById(id: string): Promise<AbsenceRecord | null> {
    const { data, error } = await supabaseClient
      .from("absence_records")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`AbsenceRecordsRepository.getById: ${error.message}`);
    return data;
  }

  async create(payload: AbsenceRecordInsert): Promise<AbsenceRecord> {
    const { data, error } = await supabaseClient
      .from("absence_records")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`AbsenceRecordsRepository.create: ${error.message}`);
    return data;
  }

  async update(id: string, payload: AbsenceRecordUpdate): Promise<AbsenceRecord> {
    const { data, error } = await supabaseClient
      .from("absence_records")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`AbsenceRecordsRepository.update: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("absence_records")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`AbsenceRecordsRepository.delete: ${error.message}`);
  }
}

export const absenceRecordsRepository = new AbsenceRecordsRepository();
