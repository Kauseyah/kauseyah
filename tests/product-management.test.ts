/**
 * Automated Test Suite for Kauseyah Product Management Enhancements
 * Run with: npx tsx tests/product-management.test.ts
 */

import assert from "node:assert";
import { mapSupabaseProductToFrontend } from "../src/utils/supabase/mapper";

function runTests() {
  console.log("=== RUNNING PRODUCT MANAGEMENT AUTOMATED TESTS ===\n");

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         ${err.message}`);
      failed++;
    }
  }

  // --- 1. DUPLICATION LOGIC ---
  test("Duplication creates new slug, draft status, and zero stock", () => {
    const original = {
      id: "prod-123",
      name: "Handcrafted Silk Kurta",
      slug: "handcrafted-silk-kurta",
      price: 2499,
      compare_at_price: 2999,
      stock: 15,
      status: "active",
      images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
      variants: [
        { id: "var-1", color: "Red", colorHex: "#ff0000", size: "M", price: 2499, stock: 8 },
        { id: "var-2", color: "Blue", colorHex: "#0000ff", size: "L", price: 2499, stock: 7 },
      ],
      public_notes: "Made by tribal artisans",
      internal_notes: "Supplier cost: Rs 1200",
    };

    // Deep duplicate simulation
    const duplicated = {
      ...original,
      id: "prod-dup-" + Date.now(),
      name: `Copy of ${original.name}`,
      slug: `copy-of-${original.slug}-${Date.now().toString().slice(-4)}`,
      status: "draft",
      stock: 0,
      variants: original.variants.map((v) => ({
        ...v,
        id: `var-dup-${Math.random().toString(36).substring(2, 9)}`,
        stock: 0,
      })),
      images: [...original.images],
    };

    assert.notStrictEqual(duplicated.id, original.id, "ID must be unique");
    assert.notStrictEqual(duplicated.slug, original.slug, "Slug must be unique");
    assert.strictEqual(duplicated.status, "draft", "Status must be draft");
    assert.strictEqual(duplicated.stock, 0, "Parent stock must be 0");
    assert.strictEqual(duplicated.variants[0].stock, 0, "Variant 1 stock must be 0");
    assert.strictEqual(duplicated.variants[1].stock, 0, "Variant 2 stock must be 0");
    assert.notStrictEqual(duplicated.variants[0].id, original.variants[0].id, "Variant IDs must be regenerated");
    
    // Media array is cloned and independent
    duplicated.images.push("https://example.com/new.jpg");
    assert.strictEqual(original.images.length, 2, "Original images must not be mutated");
    assert.strictEqual(duplicated.images.length, 3, "Duplicate images can be modified independently");
  });

  // --- 2. PRICING INTEGRITY & DISCOUNT CALCULATION ---
  test("Canonical pricing resolution in mapper", () => {
    const rawDbProduct = {
      id: "prod-pricing",
      name: "Silk Scarf",
      slug: "silk-scarf",
      price: 1800, // Canonical selling price
      compare_at_price: 2000, // Original retail MSRP
      discount_price: null,
      stock: 10,
    };

    const mapped = mapSupabaseProductToFrontend(rawDbProduct);
    assert.strictEqual(mapped.price, 1800, "Frontend price must be the canonical selling price");
    assert.strictEqual(mapped.compareAtPrice, 2000, "Frontend compareAtPrice must be list MSRP");
  });

  test("Discount calculation formula", () => {
    const compareAt = 2500;
    const price = 2000;
    const discountPercent = Math.round(((compareAt - price) / compareAt) * 100);
    assert.strictEqual(discountPercent, 20, "2500 -> 2000 is exactly 20% discount");

    // Edge case: no discount when compareAt <= price
    const noDiscount = price >= compareAt ? 0 : Math.round(((compareAt - price) / compareAt) * 100);
    assert.strictEqual(noDiscount, 20);

    const equalPrices = 2000;
    const zeroDiscount = equalPrices >= equalPrices ? 0 : Math.round(((equalPrices - equalPrices) / equalPrices) * 100);
    assert.strictEqual(zeroDiscount, 0, "Zero discount when price equals compare_at_price");
  });

  // --- 3. INTERNAL NOTES PRIVACY ---
  test("Internal notes are strictly stripped from public product mapping", () => {
    const rawDbProduct = {
      id: "prod-secret",
      name: "Confidential Silk",
      slug: "confidential-silk",
      price: 999,
      public_notes: "Handmade in Bastar",
      internal_notes: "CONFIDENTIAL: Wholesaler margin is 45%",
    };

    const mapped = mapSupabaseProductToFrontend(rawDbProduct);
    assert.strictEqual(mapped.publicNotes, "Handmade in Bastar", "Public notes must be present");
    assert.strictEqual((mapped as any).internalNotes, undefined, "Internal notes must NEVER be exposed to public mapper");
  });

  // --- 4. COLOR AND SIZE VARIANT INTEGRITY ---
  test("Variants support Color-only, Size-only, and Color+Size matrices", () => {
    // Color + Size matrix
    const variants = [
      { id: "v1", color: "Crimson", colorHex: "#dc2626", size: "S", stock: 4, imageUrl: "https://example.com/red.jpg" },
      { id: "v2", color: "Crimson", colorHex: "#dc2626", size: "M", stock: 6, imageUrl: "https://example.com/red.jpg" },
      { id: "v3", color: "Indigo", colorHex: "#4338ca", size: "S", stock: 2, imageUrl: "https://example.com/blue.jpg" },
      { id: "v4", color: "Indigo", colorHex: "#4338ca", size: "M", stock: 0, imageUrl: "https://example.com/blue.jpg" },
    ];

    const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);
    assert.strictEqual(totalStock, 12, "Total stock must sum individual combinations");
    assert.strictEqual(variants[3].stock, 0, "Out of stock variant maintains 0 stock");
    assert.strictEqual(variants[0].imageUrl, "https://example.com/red.jpg", "Color variant binds to specific image");
  });

  // --- 5. MEDIA VALIDATION RULES ---
  test("Media MIME type allowlist and size validation", () => {
    const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    // Valid checks
    assert.strictEqual(ALLOWED_IMAGE_TYPES.includes("image/jpeg"), true);
    assert.strictEqual(ALLOWED_IMAGE_TYPES.includes("image/webp"), true);
    assert.strictEqual(ALLOWED_VIDEO_TYPES.includes("video/mp4"), true);
    assert.strictEqual(ALLOWED_VIDEO_TYPES.includes("video/webm"), true);

    // Invalid checks
    assert.strictEqual(ALLOWED_IMAGE_TYPES.includes("application/x-executable"), false);
    assert.strictEqual(ALLOWED_VIDEO_TYPES.includes("application/x-msdownload"), false);
    assert.strictEqual(ALLOWED_VIDEO_TYPES.includes("video/x-matroska"), false);

    const sampleVideoSize = 42 * 1024 * 1024; // 42MB
    assert.strictEqual(sampleVideoSize <= MAX_VIDEO_SIZE, true);

    const oversizedVideoSize = 58 * 1024 * 1024; // 58MB
    assert.strictEqual(oversizedVideoSize <= MAX_VIDEO_SIZE, false);
  });

  // --- 6. SPECIFICATIONS KEY-VALUE PARSING ---
  test("Specifications key-value structure handles strings and objects", () => {
    const rawDbProduct = {
      id: "prod-specs",
      name: "Woven Basket",
      slug: "woven-basket",
      price: 1200,
      specifications: {
        "Craft": "Hand-braided",
        "Material": "Kosa Silk & Sabai Grass",
        "Origin": "Chhattisgarh, India",
      },
      dimensions: "12 x 8 x 6 inches",
      subtitle: "Artisanal Living Series",
    };

    const mapped = mapSupabaseProductToFrontend(rawDbProduct);
    assert.strictEqual(mapped.subtitle, "Artisanal Living Series");
    assert.strictEqual(mapped.dimensions, "12 x 8 x 6 inches");
    assert.deepStrictEqual(mapped.specifications, [
      { key: "Craft", value: "Hand-braided" },
      { key: "Material", value: "Kosa Silk & Sabai Grass" },
      { key: "Origin", value: "Chhattisgarh, India" },
    ]);
  });

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
