import { supabaseClient } from "@/lib/supabase/client";
import type { Inquiry, Database } from "@/types/database";

type InquiryInsert = Database["public"]["Tables"]["inquiries"]["Insert"];
type InquiryUpdate = Database["public"]["Tables"]["inquiries"]["Update"];

export interface IInquiriesRepository {
  getAll(): Promise<Inquiry[]>;
  getByTeacherId(teacherId: string): Promise<Inquiry[]>;
  getById(id: string): Promise<Inquiry | null>;
  create(payload: InquiryInsert): Promise<Inquiry>;
  update(id: string, payload: InquiryUpdate): Promise<Inquiry>;
  delete(id: string): Promise<void>;
}

export class InquiriesRepository implements IInquiriesRepository {
  async getAll(): Promise<Inquiry[]> {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(`InquiriesRepository.getAll: ${error.message}`);
    return data ?? [];
  }

  async getByTeacherId(teacherId: string): Promise<Inquiry[]> {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`InquiriesRepository.getByTeacherId: ${error.message}`);
    return data ?? [];
  }

  async getById(id: string): Promise<Inquiry | null> {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`InquiriesRepository.getById: ${error.message}`);
    return data;
  }

  async create(payload: InquiryInsert): Promise<Inquiry> {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`InquiriesRepository.create: ${error.message}`);
    return data;
  }

  async update(id: string, payload: InquiryUpdate): Promise<Inquiry> {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`InquiriesRepository.update: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`InquiriesRepository.delete: ${error.message}`);
  }
}

export const inquiriesRepository = new InquiriesRepository();
