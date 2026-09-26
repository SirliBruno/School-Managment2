export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      teachers: {
        Row: {
          id: string;
          national_id: string;
          full_name: string;
          phone_number: string;
          email: string | null;
          specialization: string | null;
          job_title: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          national_id: string;
          full_name: string;
          phone_number: string;
          email?: string | null;
          specialization?: string | null;
          job_title?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          national_id?: string;
          full_name?: string;
          phone_number?: string;
          email?: string | null;
          specialization?: string | null;
          job_title?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      absence_records: {
        Row: {
          id: string;
          teacher_id: string;
          absence_date: string;
          absence_type: "excused" | "unexcused" | "sick" | "emergency";
          status: "pending" | "justified" | "deducted" | "cancelled";
          reason: string | null;
          attachment_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          absence_date: string;
          absence_type: "excused" | "unexcused" | "sick" | "emergency";
          status?: "pending" | "justified" | "deducted" | "cancelled";
          reason?: string | null;
          attachment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          absence_date?: string;
          absence_type?: "excused" | "unexcused" | "sick" | "emergency";
          status?: "pending" | "justified" | "deducted" | "cancelled";
          reason?: string | null;
          attachment_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          teacher_id: string;
          record_id: string | null;
          inquiry_number: string;
          subject: string;
          body: string;
          status: "draft" | "sent" | "responded" | "closed";
          sent_at: string | null;
          response_text: string | null;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          record_id?: string | null;
          inquiry_number: string;
          subject: string;
          body: string;
          status?: "draft" | "sent" | "responded" | "closed";
          sent_at?: string | null;
          response_text?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          record_id?: string | null;
          inquiry_number?: string;
          subject?: string;
          body?: string;
          status?: "draft" | "sent" | "responded" | "closed";
          sent_at?: string | null;
          response_text?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      delay_notices: {
        Row: {
          id: string;
          teacher_id: string;
          delay_date: string;
          delay_minutes: number;
          status: "pending" | "justified" | "deducted";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          delay_date: string;
          delay_minutes: number;
          status?: "pending" | "justified" | "deducted";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          delay_date?: string;
          delay_minutes?: number;
          status?: "pending" | "justified" | "deducted";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      deduction_decisions: {
        Row: {
          id: string;
          teacher_id: string;
          decision_number: string;
          days_count: number;
          amount: number | null;
          reason: string;
          effective_date: string;
          status: "draft" | "approved" | "executed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          decision_number: string;
          days_count: number;
          amount?: number | null;
          reason: string;
          effective_date: string;
          status?: "draft" | "approved" | "executed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          decision_number?: string;
          days_count?: number;
          amount?: number | null;
          reason?: string;
          effective_date?: string;
          status?: "draft" | "approved" | "executed" | "cancelled";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          national_id: string;
          full_name: string;
          role: "vice_principal" | "principal" | "auditor";
          school_name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          national_id: string;
          full_name: string;
          role: "vice_principal" | "principal" | "auditor";
          school_name?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          national_id?: string;
          full_name?: string;
          role?: "vice_principal" | "principal" | "auditor";
          school_name?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity: string;
          entity_id: string | null;
          timestamp: string;
          ip_address: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity: string;
          entity_id?: string | null;
          timestamp?: string;
          ip_address?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          entity?: string;
          entity_id?: string | null;
          timestamp?: string;
          ip_address?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
export type AbsenceRecord = Database["public"]["Tables"]["absence_records"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export type DelayNotice = Database["public"]["Tables"]["delay_notices"]["Row"];
export type DeductionDecision = Database["public"]["Tables"]["deduction_decisions"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
