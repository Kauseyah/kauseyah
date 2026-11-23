-- ==============================================================================
-- Kauseyah Product Management Enhancement Migration
-- Migration Date: 2026-11-18
-- Description: Additive schema enhancements for complete product lifecycle:
--              subtitles, structured specifications, dimensions, video assets,
--              public & internal notes, and SEO metadata.
--
-- STRICT PRESERVATION:
-- 1. All existing columns and data are 100% preserved.
-- 2. Zero drop or destructive alter commands.
-- 3. Idempotent: safe to run multiple times using IF NOT EXISTS.
-- ==============================================================================

-- 1. Product Subtitle & Short Description
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subtitle TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT NULL;

-- 2. Dimensions & Structured Specifications
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS dimensions TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '[]'::jsonb;

-- 3. Product Video Media & Poster
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS video_poster_url TEXT DEFAULT NULL;

-- 4. Special Product Notes (Public vs. Internal Separation)
-- public_notes: Storefront customer-facing (customization, made-to-order, delivery)
-- internal_notes: Strictly administrative (procurement, artisan notes, supplier info)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS public_notes TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT NULL;

-- 5. SEO Title & Meta Description
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT NULL;

-- 6. Canonical Pricing (compare_at_price safety check)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.products.subtitle IS 'Supporting product heading or artisan collection descriptor';
COMMENT ON COLUMN public.products.short_description IS 'Concise product summary for cards and top of detail page';
COMMENT ON COLUMN public.products.dimensions IS 'Physical measurements (e.g. 16 x 9 x 6 inches)';
COMMENT ON COLUMN public.products.specifications IS 'Structured key-value craft and product attributes as JSONB array';
COMMENT ON COLUMN public.products.video_url IS 'Public URL of product demonstration video (MP4/WebM)';
COMMENT ON COLUMN public.products.video_poster_url IS 'Poster thumbnail image for video player';
COMMENT ON COLUMN public.products.public_notes IS 'Customer-facing notices (customization, made-to-order, delivery expectation)';
COMMENT ON COLUMN public.products.internal_notes IS 'Strictly internal administrative notes, never to be exposed to public storefront queries';
COMMENT ON COLUMN public.products.seo_title IS 'Custom meta title for search engines';
COMMENT ON COLUMN public.products.seo_description IS 'Custom meta description for search engines';
COMMENT ON COLUMN public.products.compare_at_price IS 'Original retail / MSRP list price before discount for strikethrough comparison';
