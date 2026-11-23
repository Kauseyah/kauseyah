# Kauseyah — Product Management Baseline & Architecture Audit

**Repository:** `C:\Users\ashish kathait\Downloads\kauseyah\kauseyah-product-management`  
**Branch:** `feature/admin-product-management-enhancements`  
**Production Baseline Commit:** `20b9ee1`  
**Date:** 2026-11-18

---

## 1. Executive Summary

This audit assesses the current state of product management in Kauseyah e-commerce platform and establishes the architectural baseline for the upcoming 8 major enhancement capabilities. All findings are derived directly from inspecting the codebase, database schema, server actions, cart calculations, checkout pipelines, and Supabase Storage configurations.

---

## 2. Existing vs. Missing Capabilities

| Feature Requirement | Current Implementation Status | Existing Architecture | Gaps & Missing Logic |
| :--- | :--- | :--- | :--- |
| **1. Product Duplication** | Partially Implemented | `/admin/products/new?duplicate_from=${id}` prefills title (`Copy of ...`), slug (`${slug}-copy-${rand}`), description, material, care_instructions, categories, sku (`${sku}-COPY`), prices, clones variants with stock = 0, sets status = `draft`, parent stock = 0, clones existing images. | Missing deep copy for upcoming fields: subtitle, short description, specifications, dimensions, video, and notes. Missing explicit media detachment to ensure modifying duplicate media never affects the original product assets. |
| **2. Product Video Management** | Not Implemented | None. | No video upload or preview in admin. No video player on product detail page (`ProductDetailPageClient.tsx`). Missing columns (`video_url`, `video_poster_url`), MIME validation, upload limits, and mobile responsive player. |
| **3. Colour & Size Variations** | Partially Implemented | JSONB `variants` column in `products`: `[{ id, size, color, colorHex, price, stock }]`. Size adders and "+ Add Color Variant" in admin. Swatches in storefront. | Missing color-specific image binding. Missing multi-dimensional matrix (e.g. Red-S, Red-M, Blue-S, Blue-M with discrete stock and IDs). Variant stock selection during checkout needs verification across compound options. |
| **4. Product Content Management** | Partially Implemented | Fields: `name`, `slug`, `description`, `material`, `care_instructions`, `category_id`, `subcategory`. Column `short_description` exists in DB. | Missing in UI: `subtitle`, `short_description`, structured `specifications` (key-value), `dimensions`, `seo_title`, `seo_description`. |
| **5. Special Product Notes** | Not Implemented | None. | No data structure or UI for notes (made-to-order, customization, delivery, artisan notes). Must implement two strictly segregated visibility levels: **Public Notes** (storefront) and **Internal Notes** (admin-only, excluded from public queries/APIs). |
| **6. Advanced Image Gallery** | Basic | Multi-file upload, basic preview grid. | No drag-and-drop reordering, no explicit primary/cover image selector, no independent in-place image replace, no deletion confirmation. |
| **7. Discount Pricing Consistency** | Inconsistent / Critical Risk | Columns `price`, `discount_price`, `compare_at_price` exist in DB. | Severe cross-layer inconsistency: Admin displays `discount_price` as selling price; `mapper.ts` maps `price` as selling price; `order-utils.ts` charges `dbProduct.price` ignoring discounts! Must establish unified server-authoritative model. |
| **8. Inventory & Safeguards** | Mostly Implemented | Parent stock = sum of variant stocks. Optimistic locking with rollback in `checkout.ts`. Low stock indicators (≤ 5). | Ensure negative stock prevention across compound variants; preserve existing rollback and concurrency protections. |

---

## 3. Database Schema Baseline

Inspected `products` table columns in production:
```sql
- id (UUID, PK)
- name (TEXT)
- slug (TEXT, UNIQUE)
- description (TEXT)
- short_description (TEXT)       -- Already exists in DB
- price (NUMERIC)                -- Currently represents the standard/base price
- compare_at_price (NUMERIC)      -- Already exists in DB
- discount_price (NUMERIC)        -- Legacy discount field
- category_id (UUID, FK)
- subcategory (TEXT)
- stock (INTEGER)                -- Parent aggregated stock
- images (TEXT[] / JSON)         -- Array of public URLs
- variants (JSONB)               -- Array of variant objects
- tags (TEXT[])
- material (TEXT)
- care_instructions (TEXT)
- sku (TEXT)
- status (TEXT: 'draft'|'published'|'archived')
- is_available (BOOLEAN)
- featured (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Proposed Additive Migration Columns:
- `subtitle` (TEXT, nullable)
- `specifications` (JSONB, default `'[]'::jsonb`)
- `dimensions` (TEXT, nullable)
- `video_url` (TEXT, nullable)
- `video_poster_url` (TEXT, nullable)
- `public_notes` (TEXT, nullable)
- `internal_notes` (TEXT, nullable) -- Admin only!
- `seo_title` (TEXT, nullable)
- `seo_description` (TEXT, nullable)

---

## 4. Supabase Storage Architecture

- **Active Buckets:**
  - `product-images` (Public, standard)
  - `blogs` (Public, standard)
- **Strategy:** Reuse `product-images` for all product media.
  - Images: `products/{id}/images/{random}_{timestamp}.{ext}`
  - Videos: `products/{id}/videos/{random}_{timestamp}.{ext}`
  - Poster thumbnails: `products/{id}/videos/{random}_poster.{ext}`
- Max video size: 50MB (validated server-side). MIME types: `video/mp4`, `video/webm`.
- Max image size: 10MB. MIME types: `image/jpeg`, `image/png`, `image/webp`.

---

## 5. Security & Authorization

- All admin actions (`createProduct`, `updateProduct`, `deleteProduct`) enforce `getAdminClient()` with role verification (`user_roles.role === 'admin'`).
- **Internal Notes Security:** Internal notes must NEVER be selected in public queries (such as `(shop)` routes or public search API). Public queries must explicitly omit `internal_notes`.

---

## 6. Compatibility & Rollback Assurance

- All database modifications are strictly **additive** (no column drops, no renames).
- Existing products without new fields will render gracefully with defaults.
- Zero destructive commands allowed in development or release.
