export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon_name?: string;
  display_order: number;
  is_active: boolean;
  subcategories?: Category[];
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  category?: Category;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  sku?: string;
  is_featured: boolean;
  is_published: boolean;
  rating: number;
  reviews_count: number;
  images: ProductImage[];
  attributes?: Record<string, string>;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = "DIRECT_UPI" | "COD" | "GATEWAY";
export type PaymentStatus = "PENDING" | "VERIFIED" | "FAILED" | "REFUNDED";
export type FulfillmentStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id?: string;
  product_id: string;
  product_title: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_pincode: string;
  shipping_state: string;
  total_amount: number;
  payment_method: PaymentMethod;
  utr_number?: string;
  utr_proof_image?: string;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  min_order_value?: number;
  is_active: boolean;
  description?: string;
}

export interface SiteSettings {
  id: string;
  store_name: string;
  store_tagline: string;
  merchant_upi_id: string;
  merchant_name: string;
  support_phone: string;
  support_email: string;
  announcement_bar: string;
  hero_banners: HeroBanner[];
  google_search_console_tag?: string;
  google_analytics_id?: string;
  enable_cod?: boolean;
  custom_upi_qr_url?: string;
  store_address?: string;
  instagram_url?: string;
  whatsapp_number?: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown formatted content
  cover_image: string;
  category: "Artisan Traditions" | "Home Decor Styling" | "Living with Heritage" | "Gifting Guides" | string;
  tags: string[];
  author_name: string;
  author_role: string;
  author_avatar?: string;
  read_time_minutes: number;
  reading_time?: string;
  is_published: boolean;
  published_at: string;
  featured_product_ids?: string[];
  featured_products?: string[];
  // Comprehensive SEO Suite
  primary_keyword?: string;
  secondary_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  faq_items?: BlogFaqItem[];
  meta_keywords?: string[];
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  seo?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
    primary_keyword?: string;
    secondary_keywords?: string[];
    canonical_url?: string;
  };
}

export interface CustomerAddress {
  id: string;
  customer_id?: string;
  label: "Home" | "Work" | "Other";
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  addresses?: CustomerAddress[];
  created_at?: string;
}


