import { supabaseClient } from "@/lib/supabase/client";
import type { DeductionDecision, Database } from "@/types/database";

type DeductionDecisionInsert = Database["public"]["Tables"]["deduction_decisions"]["Insert"];
type DeductionDecisionUpdate = Database["public"]["Tables"]["deduction_decisions"]["Update"];

export interface IDeductionDecisionsRepository {
  getAll(): Promise<DeductionDecision[]>;
  getByTeacherId(teacherId: string): Promise<DeductionDecision[]>;
  getById(id: string): Promise<DeductionDecision | null>;
  create(payload: DeductionDecisionInsert): Promise<DeductionDecision>;
  update(id: string, payload: DeductionDecisionUpdate): Promise<DeductionDecision>;
  delete(id: string): Promise<void>;
}

export class DeductionDecisionsRepository implements IDeductionDecisionsRepository {
  async getAll(): Promise<DeductionDecision[]> {
    const { data, error } = await supabaseClient
      .from("deduction_decisions")
      .select("*")
      .order("effective_date", { ascending: false });

    if (error) throw new Error(`DeductionDecisionsRepository.getAll: ${error.message}`);
    return data ?? [];
  }

  async getByTeacherId(teacherId: string): Promise<DeductionDecision[]> {
    const { data, error } = await supabaseClient
      .from("deduction_decisions")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("effective_date", { ascending: false });

    if (error) throw new Error(`DeductionDecisionsRepository.getByTeacherId: ${error.message}`);
    return data ?? [];
  }

  async getById(id: string): Promise<DeductionDecision | null> {
    const { data, error } = await supabaseClient
      .from("deduction_decisions")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`DeductionDecisionsRepository.getById: ${error.message}`);
    return data;
  }

  async create(payload: DeductionDecisionInsert): Promise<DeductionDecision> {
    const { data, error } = await supabaseClient
      .from("deduction_decisions")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(`DeductionDecisionsRepository.create: ${error.message}`);
    return data;
  }

  async update(id: string, payload: DeductionDecisionUpdate): Promise<DeductionDecision> {
    const { data, error } = await supabaseClient
      .from("deduction_decisions")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`DeductionDecisionsRepository.update: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from("deduction_decisions")
      .delete()
      .eq("id", id);

    if (error) throw new Error(`DeductionDecisionsRepository.delete: ${error.message}`);
  }
}

export const deductionDecisionsRepository = new DeductionDecisionsRepository();
