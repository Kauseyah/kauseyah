-- =====================================================================
-- Kauseyah: Homepage Banner Management Migration
-- File: supabase/migrations/20261117_create_homepage_banners.sql
-- Description: Dynamic full-width rotating homepage promotional banners.
-- Status: PENDING CLIENT AUTHORIZATION (DO NOT EXECUTE WITHOUT APPROVAL)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.homepage_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL DEFAULT 'general' CHECK (campaign_type IN ('festive', 'seasonal', 'promotional', 'product_launch', 'special_collection', 'general')),
  heading TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  desktop_image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  image_alt TEXT,
  offer_text TEXT,
  discount_label TEXT,
  offer_code TEXT,
  cta_text TEXT,
  cta_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_homepage_banners_status ON public.homepage_banners(status);
CREATE INDEX IF NOT EXISTS idx_homepage_banners_schedule ON public.homepage_banners(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_homepage_banners_display_order ON public.homepage_banners(display_order);

-- Enable Row Level Security
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policy: Only active, currently scheduled banners
CREATE POLICY "Public can view active eligible banners"
  ON public.homepage_banners
  FOR SELECT
  TO public
  USING (
    status = 'active' AND
    (start_at IS NULL OR start_at <= NOW()) AND
    (end_at IS NULL OR end_at >= NOW())
  );

-- 2. Administrator Full Access Policy
CREATE POLICY "Admins have full access to homepage_banners"
  ON public.homepage_banners
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_banners_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_homepage_banners_updated_at ON public.homepage_banners;
CREATE TRIGGER tr_homepage_banners_updated_at
  BEFORE UPDATE ON public.homepage_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_banners_timestamp();

-- =====================================================================
-- Rollback Instructions:
-- DROP TABLE IF EXISTS public.homepage_banners CASCADE;
-- DROP FUNCTION IF EXISTS update_homepage_banners_timestamp CASCADE;
-- =====================================================================
