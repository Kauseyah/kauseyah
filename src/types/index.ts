// ─── Product Types ───────────────────────────────────────────────────────────

export type ProductCategory =
  | "apparels"
  | "jewellery"
  | "home-living"
  | "conscious-gifting"
  | "tribal-crafts"
  | "upcycled-waste";

export type ProductTag =
  | "handmade"
  | "eco-friendly"
  | "tribal"
  | "limited-edition"
  | "bestseller"
  | "new-arrival";

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  price: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: ProductTag[];
  artisan?: Artisan;
  region?: string;
  material?: string;
  careInstructions?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
}

// ─── Collection Types ─────────────────────────────────────────────────────────

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: ProductImage;
  products?: Product[];
  theme?: string;
}

// ─── Artisan Types ────────────────────────────────────────────────────────────

export interface Artisan {
  id: string;
  name: string;
  bio: string;
  region: string;
  tribe?: string;
  avatar: string;
  craft: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface GiftDetails {
  isGift: boolean;
  packaging: boolean;
  message?: string;
  charge?: number;
}

export interface CartItem {
  id?: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  giftDetails?: GiftDetails;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  giftCharge: number;
  discount: number;
  total: number;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  shippingAddress: Address;
  total: number;
  createdAt: string;
}

// ─── User & Address Types ─────────────────────────────────────────────────────

export interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: ProductImage;
  author: string;
  publishedAt: string;
  tags: string[];
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}
