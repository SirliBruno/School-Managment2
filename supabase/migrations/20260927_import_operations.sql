-- ==============================================================================
-- Migration: 20260927_import_operations.sql
-- Description: Import operations tracking and undo log table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.import_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    total_rows INTEGER NOT NULL DEFAULT 0,
    created_records INTEGER NOT NULL DEFAULT 0,
    updated_records INTEGER NOT NULL DEFAULT 0,
    merged_records INTEGER NOT NULL DEFAULT 0,
    failed_records INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed', -- 'completed', 'reverted', 'failed'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Index for chronological queries
CREATE INDEX IF NOT EXISTS idx_import_operations_created_at ON public.import_operations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_import_operations_status ON public.import_operations(status);

-- Enable RLS
ALTER TABLE public.import_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view import operations"
    ON public.import_operations FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Authorized staff can insert import operations"
    ON public.import_operations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('vice_principal', 'principal')
        )
    );

CREATE POLICY "Authorized staff can update import operations (e.g. undo)"
    ON public.import_operations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('vice_principal', 'principal')
        )
    );
