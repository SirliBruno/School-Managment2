-- ==============================================================================
-- Migration: 20260927_teachers_management_core.sql
-- Description: Teachers table schema enhancement with indexes, constraints, and soft delete
-- ==============================================================================

-- 1. Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Alter or Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(10) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255),
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    job_title VARCHAR(100) DEFAULT 'معلمة',
    employment_type VARCHAR(50) DEFAULT 'رسمي',
    teaching_field VARCHAR(100),
    specialization VARCHAR(100),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMPTZ,
    archive_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- Add missing columns if teachers already existed from early migrations
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'mobile_number') THEN
        ALTER TABLE public.teachers ADD COLUMN mobile_number VARCHAR(20);
        -- If phone_number existed, copy data over
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'phone_number') THEN
            UPDATE public.teachers SET mobile_number = phone_number WHERE mobile_number IS NULL;
        END IF;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'normalized_name') THEN
        ALTER TABLE public.teachers ADD COLUMN normalized_name VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'employment_type') THEN
        ALTER TABLE public.teachers ADD COLUMN employment_type VARCHAR(50) DEFAULT 'رسمي';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'teaching_field') THEN
        ALTER TABLE public.teachers ADD COLUMN teaching_field VARCHAR(100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'is_archived') THEN
        ALTER TABLE public.teachers ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'archived_at') THEN
        ALTER TABLE public.teachers ADD COLUMN archived_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'archive_reason') THEN
        ALTER TABLE public.teachers ADD COLUMN archive_reason TEXT;
    END IF;
END $$;

-- 3. High-performance Indexes
CREATE INDEX IF NOT EXISTS idx_teachers_national_id ON public.teachers(national_id);
CREATE INDEX IF NOT EXISTS idx_teachers_normalized_name ON public.teachers(normalized_name);
CREATE INDEX IF NOT EXISTS idx_teachers_mobile_number ON public.teachers(mobile_number);
CREATE INDEX IF NOT EXISTS idx_teachers_is_archived ON public.teachers(is_archived);
CREATE INDEX IF NOT EXISTS idx_teachers_specialization ON public.teachers(specialization);

-- 4. Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Authenticated users can view active teachers" ON public.teachers;
CREATE POLICY "Authenticated users can view active teachers"
    ON public.teachers FOR SELECT
    TO authenticated
    USING (TRUE);

DROP POLICY IF EXISTS "Authorized users can insert teachers" ON public.teachers;
CREATE POLICY "Authorized users can insert teachers"
    ON public.teachers FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('vice_principal', 'principal')
        )
    );

DROP POLICY IF EXISTS "Authorized users can update teachers" ON public.teachers;
CREATE POLICY "Authorized users can update teachers"
    ON public.teachers FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('vice_principal', 'principal')
        )
    );
