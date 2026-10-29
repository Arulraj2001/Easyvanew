-- =========================================================================
-- EASYVA E-COMMERCE PLATFORM: COMPLETE SUPABASE POSTGRESQL SCHEMA
-- =========================================================================
-- This script configures all relational tables, indexes, triggers, storage
-- buckets, and Row Level Security (RLS) policies for Easyva.
-- Run this in your Supabase SQL Editor once your new project is created.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES (Store Admins & Customers)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 2. CATEGORIES & SUBCATEGORIES (Recursive Tree Structure)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon_name TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- -------------------------------------------------------------------------
-- 3. PRODUCTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
    cost_price NUMERIC(10, 2),
    sku TEXT UNIQUE,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    attributes JSONB DEFAULT '{}'::jsonb, -- e.g. materials, dimensions, care guide
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;

-- -------------------------------------------------------------------------
-- 4. PRODUCT IMAGES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_images_prod ON public.product_images(product_id);

-- -------------------------------------------------------------------------
-- 5. ORDERS & DIRECT ZERO-COMMISSION UPI PAYMENTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'DIRECT_UPI' CHECK (payment_method IN ('DIRECT_UPI', 'COD', 'GATEWAY')),
    utr_number TEXT UNIQUE, -- 12-digit UPI reference number submitted by customer
    utr_proof_image TEXT,  -- optional payment screenshot URL
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'VERIFIED', 'FAILED', 'REFUNDED')),
    fulfillment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (fulfillment_status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_utr ON public.orders(utr_number);

-- -------------------------------------------------------------------------
-- 6. ORDER ITEMS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    product_image TEXT,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- -------------------------------------------------------------------------
-- 7. SITE SETTINGS & HERO BANNERS (Zero-Code Dynamic Management)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'easyva_main',
    store_name TEXT NOT NULL DEFAULT 'Easyva',
    store_tagline TEXT DEFAULT 'Handcrafted Art, Jewellery & Living Decor',
    merchant_upi_id TEXT NOT NULL DEFAULT 'easyva@upi',
    merchant_name TEXT NOT NULL DEFAULT 'Easyva Artisan Crafts',
    support_phone TEXT DEFAULT '+91 8072 415 334',
    support_email TEXT DEFAULT 'muruganboutiqueandcosmetics@gmail.com',
    store_address TEXT DEFAULT 'Coimbatore, Tamil Nadu - 641001, India',
    instagram_url TEXT DEFAULT 'https://instagram.com/easyva.artisan',
    whatsapp_number TEXT DEFAULT '+91 8072 415 334',
    announcement_bar TEXT DEFAULT '✨ Free Shipping Across India on Orders Above ₹999 | 100% Handcrafted',
    hero_banners JSONB DEFAULT '[
      {
        "title": "Bespoke Art & Craftsmanship",
        "subtitle": "Discover hand-curated pottery, resin masterpieces & traditional craft",
        "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
        "cta_text": "Explore Collection",
        "cta_link": "/category/art-and-craft"
      },
      {
        "title": "Artisanal Fine Jewellery",
        "subtitle": "Elevate your grace with pure sterling silver & handcrafted stone pendants",
        "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
        "cta_text": "View Jewellery",
        "cta_link": "/category/jewellery"
      }
    ]'::jsonb,
    google_search_console_tag TEXT DEFAULT '',
    google_analytics_id TEXT DEFAULT '',
    enable_cod BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 7B. CUSTOMER SAVED ADDRESSES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL DEFAULT 'Home' CHECK (label IN ('Home', 'Work', 'Other')),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cust_addresses_customer ON public.customer_addresses(customer_id);

-- -------------------------------------------------------------------------
-- 8. INITIAL SEED DATA
-- -------------------------------------------------------------------------
-- Root Categories
INSERT INTO public.categories (id, parent_id, name, slug, description, image_url, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', NULL, 'Art & Craft', 'art-and-craft', 'Handmade paintings, pottery, resin art and artisan DIY kits', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', 1),
  ('22222222-2222-2222-2222-222222222222', NULL, 'Jewellery', 'jewellery', 'Sterling silver, artisan pendants, necklaces and handcrafted bracelets', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', 2),
  ('33333333-3333-3333-3333-333333333333', NULL, 'Home Accessories', 'home-accessories', 'Aromatherapy candles, handmade vases, and macramé wall decor', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', 3)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Art & Craft
INSERT INTO public.categories (parent_id, name, slug, description, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Handmade Paintings', 'handmade-paintings', 'Original canvas and watercolor artworks', 1),
  ('11111111-1111-1111-1111-111111111111', 'Pottery & Ceramics', 'pottery-and-ceramics', 'Hand-thrown clay mugs, planters, and bowls', 2),
  ('11111111-1111-1111-1111-111111111111', 'Resin Art & Coasters', 'resin-art', 'Ocean-inspired resin platters and home accents', 3)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Jewellery
INSERT INTO public.categories (parent_id, name, slug, description, display_order)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Necklaces & Pendants', 'necklaces-and-pendants', 'Fine gemstone and sterling silver necklaces', 1),
  ('22222222-2222-2222-2222-222222222222', 'Handcrafted Earrings', 'handcrafted-earrings', 'Minimalist studs and bohemian dangles', 2),
  ('22222222-2222-2222-2222-222222222222', 'Bracelets & Bangles', 'bracelets-and-bangles', 'Woven and silver accent wristwear', 3)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Home Accessories
INSERT INTO public.categories (parent_id, name, slug, description, display_order)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Aromatherapy & Candles', 'candles-and-diffusers', 'Soy wax organic scented candles', 1),
  ('33333333-3333-3333-3333-333333333333', 'Wall Hangings & Macramé', 'wall-hangings', 'Boho knotted wall tapestries', 2),
  ('33333333-3333-3333-3333-333333333333', 'Ceramic Vases', 'ceramic-vases', 'Modern sculptural vases for dried florals', 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed default site settings
INSERT INTO public.site_settings (id, store_name, merchant_upi_id, merchant_name)
VALUES ('easyva_main', 'Easyva', 'easyva@upi', 'Easyva Artisan Crafts')
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- Customers can view, insert, update, delete their own addresses
CREATE POLICY "Customer Own Addresses" ON public.customer_addresses FOR ALL
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- Public can read active categories, published products, and site settings
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Anyone can insert an order (Guest checkout or Customer)
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admins have full access to everything
CREATE POLICY "Admin Full Access Categories" ON public.categories FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin Full Access Images" ON public.product_images FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin Full Access Order Items" ON public.order_items FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admin Full Access Settings" ON public.site_settings FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

