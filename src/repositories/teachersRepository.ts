import { supabaseClient } from "@/lib/supabase/client";
import type { Teacher, Database } from "@/types/database";

type TeacherInsert = Database["public"]["Tables"]["teachers"]["Insert"];
type TeacherUpdate = Database["public"]["Tables"]["teachers"]["Update"];

export interface ITeachersRepository {
  getAll(): Promise<Teacher[]>;
  getById(id: string): Promise<Teacher | null>;
  getByNationalId(nationalId: string): Promise<Teacher | null>;
  create(payload: TeacherInsert): Promise<Teacher>;
  update(id: string, payload: TeacherUpdate): Promise<Teacher>;
  delete(id: string): Promise<void>;
}

export class TeachersRepository implements ITeachersRepository {
  async getAll(): Promise<Teacher[]> {
    const { data, error } = await supabaseClient
      .from("teachers")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) throw new Error(`TeachersRepository.getAll: ${error.message}`);
    return data ?? [];
  }

  async getById(id: string): Promise<Teacher | null> {
    const { data, error } = await supabaseClient
      .from("teachers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`TeachersRepository.getById: ${error.message}`);
    return data;
  }

  async getByNationalId(nationalId: string): Promise<Teacher | null> {
    const { data, error } = await supabaseClient
      .from("teachers")
      .select("*")
      .eq("national_id", nationalId)
      .maybeSingle();

    if (error) throw new Error(`TeachersRepository.getByNationalId: ${error.message}`);
    return data;
  }

  async create(payload: TeacherInsert): Promise<Teacher> {
    const { data, error } = await supabaseClient
      .from("teachers")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`TeachersRepository.create: ${error.message}`);
    return data;
  }

  async update(id: string, payload: TeacherUpdate): Promise<Teacher> {
    const { data, error } = await supabaseClient
      .from("teachers")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`TeachersRepository.update: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("teachers")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`TeachersRepository.delete: ${error.message}`);
  }
}

export const teachersRepository = new TeachersRepository();
