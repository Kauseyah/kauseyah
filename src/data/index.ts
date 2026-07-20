import type { Product, Collection, BlogPost, Artisan } from "@/types";

// ─── Mock Artisans ────────────────────────────────────────────────────────────

export const ARTISANS: Artisan[] = [
  {
    id: "a1",
    name: "Meera Devi",
    bio: "Third-generation weaver from Odisha, Meera has spent over 30 years mastering the Sambalpuri Ikat technique, a slow and meditative art form.",
    region: "Odisha",
    tribe: "Bhulia",
    avatar: "/images/about/artisan-meera.jpg",
    craft: "Sambalpuri Ikat",
  },
  {
    id: "a2",
    name: "Ramu Bhil",
    bio: "Known across Rajasthan for his intricate Bhil tribal paintings translated onto fabric, Ramu infuses ancient mythology into wearable art.",
    region: "Rajasthan",
    tribe: "Bhil",
    avatar: "/images/about/artisan-ramu.jpg",
    craft: "Bhil Textile Art",
  },
  {
    id: "a3",
    name: "Sushila Gond",
    bio: "Sushila is a celebrated Gond artist from Madhya Pradesh whose vibrant dot-work patterns are globally recognized symbols of tribal identity.",
    region: "Madhya Pradesh",
    tribe: "Gond",
    avatar: "/images/about/artisan-sushila.jpg",
    craft: "Gond Dot Art",
  },
];

// ─── Mock Collections ─────────────────────────────────────────────────────────

export const COLLECTIONS: Collection[] = [
  {
    id: "c1",
    slug: "forest-spirits",
    name: "Forest Spirits",
    description:
      "Inspired by the sacred forests of Jharkhand, this collection draws on earthy tones and tribal motifs to create pieces that feel ancient yet alive.",
    theme: "Tribal Forest",
    coverImage: { url: "/images/collections/forest-spirits.jpg", alt: "Forest Spirits Collection" },
  },
  {
    id: "c2",
    slug: "river-songs",
    name: "River Songs",
    description:
      "Woven along the banks of the Mahanadi, this handloom collection narrates stories through the rhythm of the loom.",
    theme: "Handloom Heritage",
    coverImage: { url: "/images/collections/river-songs.jpg", alt: "River Songs Collection" },
  },
  {
    id: "c3",
    slug: "festive-earth",
    name: "Festive Earth",
    description:
      "A celebration of India's tribal festivals — bold, vibrant, and deeply rooted in the joy of community.",
    theme: "Festival",
    coverImage: { url: "/images/collections/festive-earth.jpg", alt: "Festive Earth Collection" },
  },
];

// ─── Mock Products ────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "sambalpuri-ikat-saree",
    name: "Sambalpuri Ikat Saree",
    shortDescription: "Hand-woven ikat cotton saree with traditional tribal border motifs",
    description:
      "Each Sambalpuri Ikat saree takes 7–10 days of painstaking manual weaving. The tie-and-dye resist dyeing technique creates patterns that are woven directly into the warp and weft, resulting in slightly blurred edges that reflect authentic handloom excellence.",
    category: "apparels",
    subcategory: "Sarees",
    price: 4599,
    compareAtPrice: 6000,
    images: [
      { url: "/images/products/sambalpuri-ikat-1.jpg", alt: "Sambalpuri Ikat Saree Front", isPrimary: true },
      { url: "/images/indigenous_textile_close_up_1782640177042.png", alt: "Ikat Thread Close-Up" }
    ],
    variants: [
      { id: "v1", color: "Crimson Red", colorHex: "#9B2335", stock: 5, price: 4599 },
      { id: "v2", color: "Indigo Blue", colorHex: "#3C4F76", stock: 3, price: 4599 },
    ],
    tags: ["handmade", "tribal", "bestseller"],
    artisan: ARTISANS[0],
    region: "Odisha",
    material: "100% Pure Cotton",
    careInstructions: "Dry clean only. Store in a soft muslin cloth.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-02-15",
    rating: 4.8,
    reviewsCount: 3,
    reviews: [
      { id: "r1", userName: "Aditi S.", rating: 5, comment: "Absolutely stunning handloom saree. The ikat weave is flawless and the cotton is soft.", date: "2026-06-12" },
      { id: "r2", userName: "Priya M.", rating: 4, comment: "Gorgeous design. The color is slightly richer than shown, but it feels premium.", date: "2026-05-24" },
      { id: "r3", userName: "Rajashree K.", rating: 5, comment: "A true masterpiece of heritage weaving. Proud to support our traditional weavers.", date: "2026-05-01" }
    ]
  },
  {
    id: "p2",
    slug: "bhil-tribal-kurta",
    name: "Bhil Tribal Kurta",
    shortDescription: "Organic cotton kurtis featuring hand-painted Bhil visual motifs",
    description:
      "Inspired by traditional Bhil tribal paintings, this designer kurti features hand-painted clay-relieved dot motifs on fine organic cotton. Combines ancient visual folklore with modern comfort.",
    category: "apparels",
    subcategory: "Easy Cotton Kurtis",
    price: 2199,
    compareAtPrice: 2800,
    images: [
      { url: "/images/products/bhil-kurta-1.jpg", alt: "Bhil Tribal Kurta Front View", isPrimary: true },
      { url: "/images/custom_outfit.png", alt: "Bhil Kurta Styling Detail" }
    ],
    variants: [
      { id: "v3", size: "S", stock: 8, price: 2199 },
      { id: "v4", size: "M", stock: 10, price: 2199 },
      { id: "v5", size: "L", stock: 6, price: 2199 },
    ],
    tags: ["handmade", "eco-friendly", "tribal", "new-arrival"],
    artisan: ARTISANS[1],
    region: "Rajasthan",
    material: "100% Organic Handspun Cotton",
    careInstructions: "Gentle hand wash inside out with cold water and mild detergent. Dry in shade.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-03-10",
    rating: 4.5,
    reviewsCount: 2,
    reviews: [
      { id: "r4", userName: "Kavita G.", rating: 5, comment: "The hand-painted motifs are so unique. Fits perfectly and feels very breathable.", date: "2026-06-18" },
      { id: "r5", userName: "Sneha P.", rating: 4, comment: "Beautiful print, but runs slightly large. Recommend ordering a size down.", date: "2026-05-19" }
    ]
  },
  {
    id: "p3",
    slug: "gond-art-gift-box",
    name: "Gond Art Gift Hamper",
    shortDescription: "Curated eco-conscious gifting set featuring Gond artisan crafts",
    description:
      "A premium curated gift hamper celebrating the Gond tribe's intricate dot art patterns. Includes a hand-bound organic cotton journal, a pure silk bookmark, and a brass-cast coaster set.",
    category: "conscious-gifting",
    subcategory: "Gift Hampers",
    price: 1499,
    compareAtPrice: 1800,
    images: [
      { url: "/images/products/gond-gift-box-1.jpg", alt: "Gond Art Gift Box Set", isPrimary: true },
      { url: "/images/artisan-detail.png", alt: "Gond Art Pattern Card Detail" }
    ],
    variants: [{ id: "v7", stock: 20, price: 1499 }],
    tags: ["handmade", "tribal", "limited-edition"],
    artisan: ARTISANS[2],
    region: "Madhya Pradesh",
    material: "Recycled Board, Organic Silk, Brass",
    careInstructions: "Wipe coasters with a dry lint-free cloth. Store journal away from moisture.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-01-20",
    rating: 4.7,
    reviewsCount: 3,
    reviews: [
      { id: "r6", userName: "Rahul R.", rating: 5, comment: "Perfect corporate gift set. The packaging is eco-friendly and extremely elegant.", date: "2026-06-05" },
      { id: "r7", userName: "Megha S.", rating: 4, comment: "Very unique designs, bought it as a wedding anniversary gift. Highly recommend.", date: "2026-05-14" },
      { id: "r8", userName: "Amit K.", rating: 5, comment: "The Gond journal art is exquisite. High-quality paper.", date: "2026-04-30" }
    ]
  },
  {
    id: "p4",
    slug: "men-kosa-jacket",
    name: "Men Kosa Silk Jacket",
    shortDescription: "Heritage handloom Kosa silk jacket for semi-formal events",
    description:
      "Handcrafted from rare Kosa wild silk sourced directly from Chhattisgarhi weavers. Featuring a clean Nehru collar design and detailed brass buttons, this jacket offers structured refinement.",
    category: "apparels",
    subcategory: "Men Kosa Jackets",
    price: 3899,
    compareAtPrice: 5200,
    images: [
      { url: "/images/menswear.png", alt: "Men Kosa Silk Jacket Front", isPrimary: true },
      { url: "/images/indigenous_textile_close_up_1782640177042.png", alt: "Kosa Silk Texture View" }
    ],
    variants: [
      { id: "v8", size: "M", stock: 4, price: 3899 },
      { id: "v9", size: "L", stock: 5, price: 3899 },
      { id: "v10", size: "XL", stock: 2, price: 3899 }
    ],
    tags: ["handmade", "tribal", "bestseller"],
    artisan: ARTISANS[0],
    region: "Chhattisgarh",
    material: "100% Organic Kosa Silk",
    careInstructions: "Dry clean only. Hang on wooden hangers to retain shoulder shape.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-04-10",
    rating: 4.6,
    reviewsCount: 2,
    reviews: [
      { id: "r9", userName: "Vikram N.", rating: 5, comment: "The quality of the silk is amazing. Beautiful gold sheen, fit is exact.", date: "2026-06-25" },
      { id: "r10", userName: "Harish T.", rating: 4, comment: "Very comfortable to wear for summer weddings. Looks incredibly regal.", date: "2026-06-02" }
    ]
  },
  {
    id: "p5",
    slug: "dhokra-art-earrings",
    name: "Dhokra Art Earrings",
    shortDescription: "Handcrafted earrings created via lost-wax brass casting",
    description:
      "These traditional earrings are cast from bell metal (brass) using the 4000-year-old lost-wax casting technique. Features detailed tribal meshwork and hook fittings.",
    category: "jewellery",
    subcategory: "Handcrafted Earrings",
    price: 899,
    compareAtPrice: 1200,
    images: [
      { url: "/images/seasonal_edit.png", alt: "Dhokra Lost-Wax Earrings Detail", isPrimary: true }
    ],
    variants: [{ id: "v11", stock: 15, price: 899 }],
    tags: ["handmade", "tribal"],
    artisan: ARTISANS[2],
    region: "Chhattisgarh",
    material: "Bell Metal Brass",
    careInstructions: "Avoid contact with perfumes or sprays. Clean with brass polish if oxidized.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-05-02",
    rating: 4.9,
    reviewsCount: 1,
    reviews: [
      { id: "r11", userName: "Radhika J.", rating: 5, comment: "Extremely lightweight considering they are cast brass! Very artistic.", date: "2026-06-28" }
    ]
  },
  {
    id: "p6",
    slug: "gond-wall-plate",
    name: "Gond Hand-Painted Wall Plate",
    shortDescription: "Earthy Gond tribal dot art painted on ceramic plates",
    description:
      "Brighten your home with authentic Gond paintings translated onto durable ceramic wall plates. Displays a pair of signature Gond peacocks surrounded by forest flora.",
    category: "home-living",
    subcategory: "Wall Plates",
    price: 1299,
    compareAtPrice: 1600,
    images: [
      { url: "/images/artisan-detail.png", alt: "Gond Hand-Painted Wall Plate", isPrimary: true }
    ],
    variants: [{ id: "v12", stock: 12, price: 1299 }],
    tags: ["handmade", "tribal", "new-arrival"],
    artisan: ARTISANS[2],
    region: "Madhya Pradesh",
    material: "Hand-painted Ceramic",
    careInstructions: "Dust gently with dry cloth. Do not soak in water.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-05-18",
    rating: 4.4,
    reviewsCount: 2,
    reviews: [
      { id: "r12", userName: "Anjali V.", rating: 4, comment: "Looks wonderful on my living room gallery wall.", date: "2026-06-20" },
      { id: "r13", userName: "Gaurav D.", rating: 5, comment: "Incredible detail. Truly brings out the tribal aesthetic.", date: "2026-06-11" }
    ]
  },
  {
    id: "p7",
    slug: "panchagavya-diyas",
    name: "Panchagavya Organic Diyas",
    shortDescription: "Traditional bio-degradable cow dung diyas for festivals",
    description:
      "Organic, 100% biodegradable diyas crafted using sacred cow dung, milk, curd, and ghee. Ignites with a pleasant organic scent and leaves ash that serves as rich plant fertilizer.",
    category: "home-living",
    subcategory: "Cow Dung Diyas",
    price: 299,
    compareAtPrice: 400,
    images: [
      { url: "/images/shadi_collection.png", alt: "Panchagavya Organic Diyas Pack", isPrimary: true }
    ],
    variants: [{ id: "v13", stock: 100, price: 299 }],
    tags: ["handmade", "eco-friendly"],
    region: "Rajasthan",
    material: "Organic Panchagavya",
    careInstructions: "Handle with dry hands. Keep in a dry, ventilated box.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-05-20",
    rating: 4.8,
    reviewsCount: 1,
    reviews: [
      { id: "r14", userName: "Divya N.", rating: 5, comment: "Smells so pure and divine during evening prayers. Burns completely.", date: "2026-06-24" }
    ]
  },
  {
    id: "p8",
    slug: "seed-paper-toran",
    name: "Eco Seed Paper Toran",
    shortDescription: "Festive toran made from seed paper that sprouts into flowers",
    description:
      "Handcrafted using recycled cotton paper embedded with seeds. After festive celebrations, plant this door Toran in soil to sprout wild marigold and basil blooms.",
    category: "home-living",
    subcategory: "Eco Seed Paper Toran",
    price: 499,
    compareAtPrice: 650,
    images: [
      { url: "/images/who-we-are.png", alt: "Eco Seed Paper Toran Door View", isPrimary: true }
    ],
    variants: [{ id: "v14", stock: 50, price: 499 }],
    tags: ["handmade", "eco-friendly"],
    region: "Madhya Pradesh",
    material: "Seed Embedded Cotton Paper",
    careInstructions: "Keep dry. Plant in loose garden soil within 6 months.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-05-22",
    rating: 4.6,
    reviewsCount: 1,
    reviews: [
      { id: "r15", userName: "Tanya M.", rating: 5, comment: "Best sustainable decor idea. Planted it after Diwali and they sprouted!", date: "2026-06-15" }
    ]
  },
  {
    id: "p9",
    slug: "handmade-thread-rakhi",
    name: "Handmade Thread Rakhi Set",
    shortDescription: "Conscious thread rakhi set with wooden bead detailing",
    description:
      "Woven from organic cotton threads dyed using natural plants, accented with carved wooden beads. Celebrates siblings sustainably.",
    category: "conscious-gifting",
    subcategory: "Rakhi Collection",
    price: 349,
    compareAtPrice: 450,
    images: [
      { url: "/images/custom_outfit.png", alt: "Handmade Thread Rakhi Set", isPrimary: true }
    ],
    variants: [{ id: "v15", stock: 80, price: 349 }],
    tags: ["handmade", "eco-friendly"],
    region: "Odisha",
    material: "Cotton Thread & Wooden Beads",
    careInstructions: "Do not submerge in water to keep thread colors vibrant.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-06-01",
    rating: 4.7,
    reviewsCount: 1,
    reviews: [
      { id: "r16", userName: "Karan L.", rating: 5, comment: "Beautiful simple design, doesn't itch on skin at all.", date: "2026-06-27" }
    ]
  },
  {
    id: "p10",
    slug: "gond-tree-of-life",
    name: "Gond Tree of Life Canvas",
    shortDescription: "Original hand-painted canvas depicting the Gond Tree of Life",
    description:
      "Original hand-painted acrylic artwork on canvas by Gond artists, presenting the legendary cosmic tree teeming with birds, deer, and magical forest creatures in fine signature dot-work style.",
    category: "tribal-crafts",
    subcategory: "Gond Art",
    price: 4999,
    compareAtPrice: 6500,
    images: [
      { url: "/images/artisan_workshop_portrait_1782640198563.png", alt: "Gond Tree of Life Canvas Painting", isPrimary: true }
    ],
    variants: [{ id: "v16", stock: 2, price: 4999 }],
    tags: ["handmade", "tribal", "limited-edition"],
    artisan: ARTISANS[2],
    region: "Madhya Pradesh",
    material: "Acrylic on Cotton Canvas",
    careInstructions: "Keep out of direct sunlight. Frame under anti-reflective glass.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-04-20",
    rating: 5.0,
    reviewsCount: 1,
    reviews: [
      { id: "r17", userName: "Sonal A.", rating: 5, comment: "Breathtaking original canvas. The dot work is hypnotic.", date: "2026-06-09" }
    ]
  },
  {
    id: "p11",
    slug: "dhokra-bell-metal-nandi",
    name: "Dhokra Bell Metal Nandi",
    shortDescription: "Traditional lost-wax bell metal casting of sacred Nandi Bull",
    description:
      "An iconic bell metal sculpture of the Nandi bull, cast in Bastar using the complex lost-wax brass casting technique. Rich textured lines trace its humped back.",
    category: "tribal-crafts",
    subcategory: "Dhokra Craft",
    price: 2499,
    compareAtPrice: 3200,
    images: [
      { url: "/images/indigenous_textile_close_up_1782640177042.png", alt: "Dhokra Bell Metal Nandi", isPrimary: true }
    ],
    variants: [{ id: "v17", stock: 6, price: 2499 }],
    tags: ["handmade", "tribal"],
    artisan: ARTISANS[1],
    region: "Chhattisgarh",
    material: "Lost-Wax Bell Metal Brass",
    careInstructions: "Clean dust with soft brass polish or direct dry cloth wiping.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-05-10",
    rating: 4.8,
    reviewsCount: 1,
    reviews: [
      { id: "r18", userName: "Ramesh C.", rating: 5, comment: "Beautiful weight and finish. Authentically Bastar.", date: "2026-06-22" }
    ]
  },
  {
    id: "p12",
    slug: "upcycled-cotton-elephant",
    name: "Upcycled Cotton Elephant",
    shortDescription: "Zero-waste textile toy stuffed with organic cotton scraps",
    description:
      "A soft companion stuffed elephant toy handcrafted by women self-help groups. Made using leftover cotton yardage scraps from our clothing production.",
    category: "upcycled-waste",
    subcategory: "Textile Toys",
    price: 599,
    compareAtPrice: 800,
    images: [
      { url: "/images/toy_elephant.png", alt: "Upcycled Cotton Elephant Toy Side view", isPrimary: true },
      { url: "/images/toy_camel.png", alt: "Zero-waste Toy Friends Group" },
      { url: "/images/toy_bird.png", alt: "Zero-waste Toy Detail" }
    ],
    variants: [{ id: "v18", stock: 25, price: 599 }],
    tags: ["handmade", "eco-friendly"],
    region: "Chhattisgarh",
    material: "Upcycled Organic Cotton Scraps",
    careInstructions: "Spot cleaning or gentle warm machine wash in a laundry bag.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-06-05",
    rating: 4.9,
    reviewsCount: 2,
    reviews: [
      { id: "r19", userName: "Jaya R.", rating: 5, comment: "Bought this for my toddler, she loves the patchwork patterns. Safe and soft.", date: "2026-06-28" },
      { id: "r20", userName: "Amit S.", rating: 5, comment: "Zero-waste, safe for kids, and beautifully crafted.", date: "2026-06-19" }
    ]
  },
  {
    id: "p13",
    slug: "kosa-wild-silk-saree",
    name: "Kosa Wild Silk Saree",
    shortDescription: "Luxurious handloom golden wild silk saree from Champa",
    description: "Handwoven in Champa, Chhattisgarh, this Kosa wild silk saree features a rich natural texture and golden luster. Handcrafted by master weavers, it reflects the true essence of forest silk.",
    category: "apparels",
    subcategory: "Sarees",
    price: 6899,
    compareAtPrice: 8500,
    images: [
      { url: "/images/indigenous_textile_close_up_1782640177042.png", alt: "Kosa Wild Silk Saree Full View", isPrimary: true }
    ],
    variants: [{ id: "v19", stock: 8, price: 6899, size: "Free Size", color: "Natural Gold", colorHex: "#D4AF37" }],
    tags: ["handmade", "bestseller", "new-arrival"],
    region: "Chhattisgarh",
    material: "100% Kosa Wild Silk",
    careInstructions: "Dry clean only. Store wrapped in soft muslin cloth.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-06-12",
    rating: 4.9,
    reviewsCount: 3,
    reviews: [
      { id: "r21", userName: "Asha P.", rating: 5, comment: "Magnificent texture! The natural gold luster is stunning.", date: "2026-06-25" },
      { id: "r22", userName: "Priyanka G.", rating: 5, comment: "Pure authenticity. Very lightweight and elegant.", date: "2026-06-28" }
    ]
  },
  {
    id: "p14",
    slug: "bhil-hand-painted-saree",
    name: "Bhil Hand-Painted Saree",
    shortDescription: "Organic cotton saree featuring stories hand-painted by Bhil artists",
    description: "This organic cotton saree is hand-painted by Bhil tribal artists from Rajasthan. The hand-painted visual motifs depict traditional forest rituals and celebratory dances, making it a piece of wearable folklore.",
    category: "apparels",
    subcategory: "Sarees",
    price: 5299,
    compareAtPrice: 7000,
    images: [
      { url: "/images/custom_outfit.png", alt: "Bhil Hand-Painted Saree", isPrimary: true }
    ],
    variants: [{ id: "v20", stock: 3, price: 5299, size: "Free Size", color: "Tribal Cream", colorHex: "#FFFDD0" }],
    tags: ["handmade", "tribal"],
    region: "Rajasthan",
    material: "Organic Khadi Cotton",
    careInstructions: "Gentle hand wash inside out with mild detergent.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-06-18",
    rating: 4.8,
    reviewsCount: 2,
    reviews: [
      { id: "r23", userName: "Meera D.", rating: 5, comment: "It feels like wearing a canvas. The painting details are beautiful.", date: "2026-06-29" }
    ]
  },
  {
    id: "p15",
    slug: "tussar-handloom-saree",
    name: "Tussar Silk Handloom Saree",
    shortDescription: "Hand-spun Tussar silk saree with temple border work",
    description: "Woven in the rural clusters of Odisha, this Tussar silk saree features delicate thread work borders inspired by tribal temple carvings. Crafted by weaver families using generations-old wooden looms.",
    category: "apparels",
    subcategory: "Sarees",
    price: 5899,
    compareAtPrice: 7200,
    images: [
      { url: "/images/about/about.jpeg", alt: "Tussar Silk Handloom Saree Detail View", isPrimary: true }
    ],
    variants: [{ id: "v21", stock: 5, price: 5899, size: "Free Size", color: "Forest Crimson", colorHex: "#8B0000" }],
    tags: ["handmade", "limited-edition", "new-arrival"],
    region: "Odisha",
    material: "Tussar Silk",
    careInstructions: "Dry clean only. Cool iron on reverse.",
    isAvailable: true,
    isFeatured: true,
    createdAt: "2026-06-20",
    rating: 4.7,
    reviewsCount: 1,
    reviews: [
      { id: "r24", userName: "Aditi S.", rating: 4, comment: "Beautiful borders and authentic weave feel.", date: "2026-06-28" }
    ]
  },
  {
    id: "p16",
    slug: "dhokra-motif-saree",
    name: "Dhokra Motif Handloom Saree",
    shortDescription: "Cotton handloom saree with block-printed Dhokra brass shapes",
    description: "Pure cotton handloom saree with block-printed motifs inspired by Bastar Dhokra brass castings and tribal patterns. Soft, lightweight, and perfect for ethnic everyday wear.",
    category: "apparels",
    subcategory: "Sarees",
    price: 3499,
    compareAtPrice: 4500,
    images: [
      { url: "/images/products/sambalpuri-ikat-1.jpg", alt: "Dhokra Motif Handloom Saree", isPrimary: true }
    ],
    variants: [{ id: "v22", stock: 12, price: 3499, size: "Free Size", color: "Bastar Indigo", colorHex: "#3F51B5" }],
    tags: ["handmade", "new-arrival"],
    region: "Chhattisgarh",
    material: "100% Handloom Cotton",
    careInstructions: "Hand wash separately in cold water.",
    isAvailable: true,
    isFeatured: false,
    createdAt: "2026-06-22",
    rating: 4.6,
    reviewsCount: 1,
    reviews: [
      { id: "r25", userName: "Rohini K.", rating: 5, comment: "Very soft cotton, great block printing work.", date: "2026-06-29" }
    ]
  }
];

// ─── Mock Blog Posts ──────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    slug: "story-of-ikat",
    title: "The Story of Ikat: Threads That Carry Time",
    excerpt:
      "Ikat is not just a weaving technique — it is a language of patience, culture, and identity passed down through generations.",
    content: "",
    coverImage: { url: "/images/blog/story-of-ikat.jpg", alt: "Ikat weaving" },
    author: "Kauseyah Editorial",
    publishedAt: "2024-11-10",
    tags: ["handloom", "ikat", "artisan-spotlight"],
  },
  {
    id: "b2",
    slug: "bhil-visual-universe",
    title: "The Bhil Visual Universe: Art as Rebellion",
    excerpt:
      "For the Bhil people, painting is not decorative — it is documentary, devotional, and defiant.",
    content: "",
    coverImage: { url: "/images/blog/bhil-art.jpg", alt: "Bhil tribal art" },
    author: "Kauseyah Editorial",
    publishedAt: "2024-12-05",
    tags: ["tribal", "bhil", "culture"],
  },
];
