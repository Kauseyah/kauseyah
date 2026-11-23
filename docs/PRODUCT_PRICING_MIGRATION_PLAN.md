# Kauseyah — Product Pricing Model & Migration Plan

**Repository:** `C:\Users\ashish kathait\Downloads\kauseyah\kauseyah-product-management`  
**Branch:** `feature/admin-product-management-enhancements`  
**Date:** 2026-11-18

---

## 1. Problem Statement & Audit Findings

The pricing system currently suffers from cross-layer semantic contradictions:
1. **Admin Product Listing (`src/app/admin/products/page.tsx`):**
   - If `product.discount_price` exists: shows `₹{product.discount_price}` as primary and `₹{product.price}` as strikethrough.
   - Meaning: `price` = Original price, `discount_price` = Selling price.
2. **Frontend Mapper (`src/utils/supabase/mapper.ts`):**
   - `price: sbProduct.price`
   - `compareAtPrice: sbProduct.discount_price || undefined`
   - Meaning: `price` = Selling price, `discount_price` = Compare-at/original price.
3. **Product Detail Page (`src/components/pages/ProductDetailPageClient.tsx`):**
   - Displays `product.price` as the main bold price.
   - Displays `product.compareAtPrice` as strikethrough with `Save X%`.
4. **Checkout Engine (`src/utils/order-utils.ts`):**
   - `itemPrice = dbProduct.price`
   - Charges `dbProduct.price` directly! If an admin had entered a `discount_price` intending it to be a discounted selling price, the customer was still charged `dbProduct.price`!

---

## 2. Canonical Pricing Architecture

To eliminate ambiguity and ensure 100% financial integrity, we adopt the industry standard (Shopify / BigCommerce / WooCommerce) canonical schema:

### Canonical Terms:
1. **Selling Price (`price`):**
   - The authoritative amount the customer actually pays at checkout.
   - Used by Razorpay, COD totals, shipping threshold calculations, and cart totals.
   - Non-negative number (`>= 0`).
2. **Original / List Price (`compare_at_price`):**
   - The manufacturer or regular retail price before discount (MSRP).
   - Displayed with strikethrough on storefront cards and product detail pages.
   - When set, it must be strictly greater than the selling price (`compare_at_price > price`).
   - If null or equal to `price`, no discount is active (no strikethrough, no discount badge).
3. **Discount Percentage (`discount_percent`):**
   - Calculated dynamically:
     $$\text{Discount \%} = \text{round}\left(\frac{\text{compare\_at\_price} - \text{price}}{\text{compare\_at\_price}} \times 100\right)$$
   - Rendered as `Save X%` badge.
4. **Legacy Field (`discount_price`):**
   - Retained in the database for backward compatibility with older queries, mapped such that if a record had `discount_price`, the system reconciles it safely without price spikes.

---

## 3. Layer-by-Layer Synchronization Plan

| Layer | Canonical Field Used for Customer Charge | Strikethrough Reference | Validation Enforced |
| :--- | :--- | :--- | :--- |
| **Admin Editor** | Admin inputs: "Selling Price" & optional "Original / List Price (MSRP)" | Visual preview with live calculated `Save X%` badge | Ensures `compare_at_price > price` when discount is entered. |
| **Admin Listing** | Prominent `₹{price}` | Strikethrough `₹{compare_at_price}` if discounted | Color-coded discount badge. |
| **Storefront Cards** | Prominent `₹{price}` | Strikethrough `₹{compare_at_price}` | `Save X%` badge displayed only if `compare_at_price > price`. |
| **Product Detail** | Prominent `₹{selectedVariant.price \|\| price}` | Strikethrough `₹{compare_at_price}` | Dynamic update on variant change. |
| **Cart & Subtotal** | `item.variant.price \|\| item.product.price` | Strikethrough comparison in item row | Accurate subtotal calculation. |
| **Checkout & Razorpay (`order-utils.ts`)** | **Authoritative server-side lookup:** `dbProduct.price` (or `dbVariant.price`). Client-submitted prices are discarded. | N/A | Absolute price validation on server before creating Razorpay order or COD record. |

---

## 4. Historical Order Preservation

Historical orders in `orders` and `order_items` tables already store the exact captured price at the moment of payment. Historical order records are **never modified or recalculated** when product prices are updated.
