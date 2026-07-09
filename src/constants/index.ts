import type { NavLink } from "@/types";

// ─── Site Metadata ────────────────────────────────────────────────────────────

export const SITE_NAME = "Kauseyah";
export const SITE_TAGLINE = "Woven by Hands. Born from Tribes.";
export const BRAND_TAGLINE = "Grassroot | Local | Indigenous";
export const SITE_DESCRIPTION =
  "Kauseyah is a curated clothing brand celebrating India's handloom heritage and tribal artistry. Discover ethically made garments, hand-woven textiles, and authentic tribal gifts.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kauseyah.com";
export const CONTACT_EMAIL = "shwetarao17@gmail.com";
export const CONTACT_PHONE = "+91-9741257206";
export const WHATSAPP_NUMBER = "+91 98765 43210";

export const FOUNDER = {
  name: "Shweta Rao",
  role: "Founder, Kauseyah",
  title: "Fashion Designer & Craft Researcher",
  paragraphs: [
    "Shweta Rao is a fashion designer and craft researcher, and a graduate of the National Institute of Fashion Technology (NIFT). Having grown up in Chhattisgarh, she was exposed from an early age to the region's rich tribal culture, handloom traditions, and rural craft practices. This experience inspired her to dedicate her career to working with artisan communities and promoting India's heritage.",
    "With over a decade of experience researching and working alongside rural weavers and craftspeople, Shweta combines design expertise with grassroots engagement. Through Kauseyah, she strives to create sustainable livelihood opportunities for artisans while bringing traditional crafts, handlooms, and cultural stories to wider audiences in India and abroad. Her work is driven by a deep commitment to cultural preservation, sustainability, ethical design, and community empowerment.",
  ],
};

export const ABOUT_KAUSEYAH = {
  title: "About Kauseyah",
  paragraphs: [
    "Kauseyah is a conscious design and craft initiative inspired by the rich tribal and cultural heritage of Chhattisgarh. Founded with the vision of preserving India's diverse craft traditions, Kauseyah works closely with tribal artisan communities and rural weavers across different regions of the country.",
    "The brand focuses on reviving, promoting, and creating market opportunities for traditional handlooms, indigenous crafts products that are deeply rooted in local knowledge systems. Through design intervention, product development, and storytelling, Kauseyah aims to bridge the gap between traditional craftsmanship and contemporary markets.",
    "Sustainability lies at the heart of the brand. Along with promoting handmade and handloom products, Kauseyah actively incorporates upcycled and recycled materials into its creations, transforming textile remnants and waste materials into meaningful products. This approach not only reduces waste but also creates additional livelihood opportunities for artisans and women involved in the production process.",
    "Over the years, Kauseyah has collaborated with artisans working in handloom weaving, embroidery, tribal arts, natural fibers, grass crafts and other indigenous craft forms. The initiative is committed to preserving age-old skills, encouraging ethical consumption, and ensuring that traditional knowledge is passed on to future generations.",
  ],
};

export const CONTACT_HERO = {
  eyebrow: "Get in Touch",
  title: "Contact Us",
  intro:
    "Have a question about an order, a custom piece, or partnering with our artisans? We'd love to hear from you.",
  quote:
    "Whether it's an order, a custom piece, or a partnership — we're here to listen.",
  note: "Our team typically responds within 24 hours.",
};

export const GALLERY_HERO = {
  eyebrow: "Visual Stories",
  title: "Gallery",
  intro:
    "Step inside the world of handloom and tribal craft — where every photograph and frame captures the patience, skill, and living heritage behind Kauseyah.",
  quote:
    "Every frame holds a thread of heritage — woven, painted, and passed forward.",
  note: "Handloom · Tribal Art · Conscious Craft",
};

export const GALLERY_INTRO = {
  lead: "More than a collection of images — this is craft in its truest form.",
  body:
    "From the loom to the workshop, these moments document the hands, tools, and traditions that shape every Kauseyah creation. Each image and clip is a quiet celebration of indigenous art kept alive.",
};

export const GALLERY_VIDEO = {
  src: "/images/artesian/inshort.mp4",
  title: "Behind the Loom",
  description:
    "A short film capturing the rhythm of handloom weaving — the movement of hands, threads, and tradition coming together in real time.",
};

export const GALLERY_ITEMS = [
  {
    src: "/images/artesian/image1.jpg",
    alt: "Kauseyah branded kraft envelope against ancient stone temple carvings",
    width: 2992,
    height: 2992,
    title: "Heritage Brand Packaging",
    description:
      "Kauseyah's kraft envelope — printed with a charkha illustration and the words \"Crafted by the tribal artisans of Chhattisgarh\" — held against centuries-old stone temple carvings.",
  },
  {
    src: "/images/artesian/image2.jpg",
    alt: "Young woman weaving bright red fabric on a floor handloom",
    width: 2992,
    height: 2992,
    title: "Weaving Red Ikat",
    description:
      "An artisan works a floor loom, weaving vivid red cloth with geometric ikat patterns — shuttle in hand, thread by thread.",
  },
  {
    src: "/images/artesian/image3.png",
    alt: "Handmade block-print journal gift set in a fabric basket",
    width: 992,
    height: 1056,
    title: "Hand-Bound Journal Set",
    description:
      "A curated gift hamper of block-printed handmade journals, wooden pencils, a beeswax candle, and dried botanicals — each cover patterned by hand.",
  },
  {
    src: "/images/artesian/image4.png",
    alt: "Artisan weaving a pink and red patola-style saree on a large handloom",
    width: 704,
    height: 1527,
    title: "Patola-Style Saree Loom",
    description:
      "At a large blue-framed handloom, an artisan weaves a shimmering pink saree with an ornate red and gold border — a technique demanding precision and patience.",
  },
  {
    src: "/images/artesian/image5.webp",
    alt: "Stack of Kauseyah kraft paper brand pouches",
    width: 1080,
    height: 1920,
    title: "Sustainable Packaging",
    description:
      "Eco-friendly kraft pouches stamped with the Kauseyah name, charkha motif, and the promise of local, indigenous, grassroots craft from Chhattisgarh.",
  },
  {
    src: "/images/artesian/image6.png",
    alt: "Hand-painted Dhokra Ganesha figurine in a branded jute pouch",
    width: 1632,
    height: 2176,
    title: "Dhokra Ganesha Figurines",
    description:
      "Vibrant hand-painted Ganesha figurines nestled in branded jute drawstring pouches — tribal metal craft presented with care.",
  },
  {
    src: "/images/artesian/image7.jpeg",
    alt: "Woman in mint green block-print kurta at a rustic mud-house window",
    width: 1200,
    height: 1600,
    title: "Block-Print Kurta",
    description:
      "A floral block-printed kurta in mint green, worn at the wooden window of a traditional mud house — craft meeting everyday life.",
  },
  {
    src: "/images/artesian/image8.jpeg",
    alt: "Woman standing inside an ornate carved stone chhatri pavilion",
    width: 960,
    height: 1280,
    title: "Carved Stone Chhatri",
    description:
      "An intricately carved sandstone pavilion with a domed roof and floral pillars — heritage architecture set against rolling green hills.",
  },
  {
    src: "/images/artesian/image9.jpeg",
    alt: "Telia Rumal yarn display at a textile exhibition",
    width: 3120,
    height: 4160,
    title: "Telia Rumal Yarn",
    description:
      "Long bundles of oil-pretreated yarn on display at an exhibition — the first step in creating Telia Rumal, a double-ikat textile from Telangana.",
  },
  {
    src: "/images/artesian/image10.jpeg",
    alt: "Exhibition pillars wrapped in traditional block-print and ikat fabrics",
    width: 3120,
    height: 4160,
    title: "Textile Exhibition",
    description:
      "Pillars draped in hand-block printed and ikat fabrics from Kutch — including motifs inspired by the 18 dreams of Queen Trishala in Jain tradition.",
  },
  {
    src: "/images/artesian/image11.jpeg",
    alt: "Colourful stylised folk art sculpture of a woman's face in a gallery",
    width: 1200,
    height: 1600,
    title: "Folk Art Sculpture",
    description:
      "A bold, stylised sculpture of a woman's face — red lips, gold jewellery, and traditional motifs reimagined in contemporary form.",
  },
  {
    src: "/images/artesian/image12.jpg",
    alt: "Two women smiling together in a handloom weaving workshop",
    width: 2992,
    height: 2992,
    title: "Workshop Partners",
    description:
      "Two women stand together in a weaving workshop, red warp threads stretched on the loom behind them — partnership at the heart of every piece.",
  },
] as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Shop Now",
    href: "/products",
    children: [
      // ── Handlooms ──
      { label: "Sarees", href: "/collections/sarees" },
      { label: "Easy Cotton Kurtis", href: "/collections/kurtis" },
      { label: "Dupattas", href: "/collections/dupattas" },
      { label: "Stoles", href: "/collections/stoles" },
      { label: "Fabric Yardages", href: "/collections/fabric-yardages" },
      { label: "Men Kosa Jackets", href: "/collections/kosa-jackets" },
      // ── Jewellery ──
      { label: "Handcrafted Earrings", href: "/collections/earrings" },
      // ── Home & Living ──
      { label: "Baskets", href: "/collections/baskets" },
      { label: "Wall Plates", href: "/collections/wall-plates" },
      { label: "Cow Dung Diyas", href: "/collections/diyas" },
      { label: "Hand Painted Fridge Magnets", href: "/collections/fridge-magnets" },
      { label: "Hand Painted Incense Stick Holders", href: "/collections/incense-holders" },
      { label: "Eco Seed Paper Toran", href: "/collections/toran" },
      // ── Conscious Gifting ──
      { label: "Gift Hampers", href: "/collections/gift-hampers" },
      { label: "Rakhi Collection", href: "/collections/rakhi" },
      { label: "Sunglass Pouch", href: "/collections/sunglass-pouch" },
      { label: "Brass Plates", href: "/collections/brass-plates" },
      // ── Tribal & Artisan Crafts ──
      { label: "Gond Art", href: "/collections/gond-art" },
      { label: "Dhokra Craft", href: "/collections/dhokra-craft" },
      // ── Upcycled & Zero Waste ──
      { label: "Textile Toys", href: "/collections/textile-toys" },
      { label: "Faabr", href: "/collections/faabr" },
    ],
  },
  { label: "Our Story", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// ─── Shop Category Groups (for mega-menu and homepage) ───────────────────────

export const SHOP_CATEGORY_GROUPS = [
  {
    id: "handlooms",
    label: "Handlooms",
    href: "/collections/handlooms",
    icon: "🧵",
    description: "Authentic hand-woven textiles from master weavers",
    items: [
      { label: "Sarees", href: "/collections/sarees" },
      { label: "Easy Cotton Kurtis", href: "/collections/kurtis" },
      { label: "Dupattas", href: "/collections/dupattas" },
      { label: "Stoles", href: "/collections/stoles" },
      { label: "Fabric Yardages", href: "/collections/fabric-yardages" },
      { label: "Men Kosa Jackets", href: "/collections/kosa-jackets" },
    ],
  },
  {
    id: "jewellery",
    label: "Jewellery",
    href: "/collections/jewellery",
    icon: "📿",
    description: "Handcrafted adornments rooted in tradition",
    items: [
      { label: "Handcrafted Earrings", href: "/collections/earrings" },
    ],
  },
  {
    id: "home-living",
    label: "Home & Living",
    href: "/collections/home-living",
    icon: "🏺",
    description: "Earth-conscious decor for mindful living",
    items: [
      { label: "Baskets", href: "/collections/baskets" },
      { label: "Wall Plates", href: "/collections/wall-plates" },
      { label: "Cow Dung Diyas", href: "/collections/diyas" },
      { label: "Hand Painted Fridge Magnets", href: "/collections/fridge-magnets" },
      { label: "Hand Painted Incense Stick Holders", href: "/collections/incense-holders" },
      { label: "Eco Seed Paper Toran", href: "/collections/toran" },
    ],
  },
  {
    id: "conscious-gifting",
    label: "Conscious Gifting",
    href: "/collections/conscious-gifting",
    icon: "🎁",
    description: "Thoughtful gifts with stories behind them",
    items: [
      { label: "Gift Hampers", href: "/collections/gift-hampers" },
      { label: "Rakhi Collection", href: "/collections/rakhi" },
      { label: "Sunglass Pouch", href: "/collections/sunglass-pouch" },
      { label: "Brass Plates", href: "/collections/brass-plates" },
    ],
  },
  {
    id: "tribal-crafts",
    label: "Tribal & Artisan Crafts",
    href: "/collections/tribal-crafts",
    icon: "🖌️",
    description: "Living traditions from indigenous communities",
    items: [
      { label: "Gond Art", href: "/collections/gond-art" },
      { label: "Dhokra Craft", href: "/collections/dhokra-craft" },
    ],
  },
  {
    id: "upcycled",
    label: "Upcycled & Zero Waste",
    href: "/collections/upcycled",
    icon: "♻️",
    description: "Conscious creativity — waste reimagined beautifully",
    items: [
      { label: "Textile Toys", href: "/collections/textile-toys" },
      { label: "Faabr", href: "/collections/faabr" },
    ],
  },
];

// ─── Product Categories (simplified for filters) ─────────────────────────────

export const CATEGORIES = [
  {
    id: "handlooms",
    label: "Handlooms",
    slug: "handlooms",
    description: "Authentic hand-woven textiles from master weavers",
    icon: "🧵",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    slug: "jewellery",
    description: "Handcrafted adornments rooted in tradition",
    icon: "📿",
  },
  {
    id: "home-living",
    label: "Home & Living",
    slug: "home-living",
    description: "Earth-conscious decor for mindful living",
    icon: "🏺",
  },
  {
    id: "conscious-gifting",
    label: "Conscious Gifting",
    slug: "conscious-gifting",
    description: "Thoughtful gifts with stories behind them",
    icon: "🎁",
  },
  {
    id: "tribal-crafts",
    label: "Tribal & Artisan Crafts",
    slug: "tribal-crafts",
    description: "Living traditions from indigenous communities",
    icon: "🖌️",
  },
  {
    id: "upcycled",
    label: "Upcycled & Zero Waste",
    slug: "upcycled",
    description: "Conscious creativity — waste reimagined",
    icon: "♻️",
  },
];

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PRODUCTS_PER_PAGE = 12;

// ─── Sort Options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest First", value: "newest" },
  { label: "Bestsellers", value: "bestseller" },
];

// ─── Social Links ─────────────────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/kauseyah_com/?hl=en",
  facebook: "https://facebook.com/kauseyah",
  pinterest: "https://pinterest.com/kauseyah",
  youtube: "https://youtube.com/@kauseyah",
  linkedin: "https://www.linkedin.com/in/shwetarao-p/",
};

// ─── Shipping ─────────────────────────────────────────────────────────────────

export const FREE_SHIPPING_THRESHOLD = 999; // INR
export const STANDARD_SHIPPING_FEE = 99;
