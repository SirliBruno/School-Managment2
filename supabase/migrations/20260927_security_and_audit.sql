-- Administrative Absence Platform - Security & RBAC Migration
-- Row Level Security (RLS) and Audit Logging Schema

-- 1. Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  national_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('vice_principal', 'principal', 'auditor')),
  school_name TEXT NOT NULL DEFAULT 'المدرسة النموذجية الحديثة',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delay_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deduction_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Helper Function: Get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. RLS Policies

-- Deny anon completely across administrative tables
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.teachers FROM anon;
REVOKE ALL ON public.absence_records FROM anon;
REVOKE ALL ON public.inquiries FROM anon;
REVOKE ALL ON public.delay_notices FROM anon;
REVOKE ALL ON public.deduction_decisions FROM anon;
REVOKE ALL ON public.audit_logs FROM anon;

-- Profiles: Authenticated users can view their own profile, principal/auditor can view all
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.get_current_user_role() IN ('principal', 'auditor'));

-- Teachers: Viewable by all authenticated staff, mutable by vice_principal & principal
CREATE POLICY "teachers_select_staff" ON public.teachers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "teachers_modify_authorized" ON public.teachers
  FOR ALL TO authenticated
  USING (public.get_current_user_role() IN ('vice_principal', 'principal'))
  WITH CHECK (public.get_current_user_role() IN ('vice_principal', 'principal'));

-- Absence Records: Viewable by staff, created by vice_principal, approved by principal
CREATE POLICY "absence_select_staff" ON public.absence_records
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "absence_insert_vice_principal" ON public.absence_records
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('vice_principal', 'principal'));

CREATE POLICY "absence_update_authorized" ON public.absence_records
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() IN ('vice_principal', 'principal'));

-- Inquiries: Mutable by vice_principal and principal
CREATE POLICY "inquiries_select_staff" ON public.inquiries
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "inquiries_modify_authorized" ON public.inquiries
  FOR ALL TO authenticated
  USING (public.get_current_user_role() IN ('vice_principal', 'principal'))
  WITH CHECK (public.get_current_user_role() IN ('vice_principal', 'principal'));

-- Deduction Decisions: Only principal can approve and execute
CREATE POLICY "deductions_select_staff" ON public.deduction_decisions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "deductions_insert_authorized" ON public.deduction_decisions
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('vice_principal', 'principal'));

CREATE POLICY "deductions_update_principal_only" ON public.deduction_decisions
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() = 'principal')
  WITH CHECK (public.get_current_user_role() = 'principal');

-- Audit Logs: Insertable by system, viewable by auditor and principal only
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "audit_logs_select_auditor_principal" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('auditor', 'principal'));
