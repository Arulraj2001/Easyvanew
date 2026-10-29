import fs from "fs/promises";
import path from "path";
import { Category, Product, Order, SiteSettings, Coupon, CustomerAddress, CustomerProfile, BlogPost } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

interface StoreData {
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  coupons?: Coupon[];
  addresses?: CustomerAddress[];
  profiles?: CustomerProfile[];
  blog_posts?: BlogPost[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const INITIAL_SEED: StoreData = {
  categories: [
    {
      id: "cat-art-craft",
      parent_id: null,
      name: "Art & Craft",
      slug: "art-and-craft",
      description: "Original paintings, handmade ceramics, resin craft and artisan creation kits",
      image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
      icon_name: "Palette",
      display_order: 1,
      is_active: true,
      subcategories: [
        {
          id: "sub-paintings",
          parent_id: "cat-art-craft",
          name: "Handmade Paintings",
          slug: "handmade-paintings",
          description: "Original canvas, oil and acrylic works by indie artists",
          image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
          display_order: 1,
          is_active: true,
        },
        {
          id: "sub-pottery",
          parent_id: "cat-art-craft",
          name: "Pottery & Ceramics",
          slug: "pottery-and-ceramics",
          description: "Hand-thrown clay mugs, bowls, and artisanal tableware",
          image_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80",
          display_order: 2,
          is_active: true,
        },
        {
          id: "sub-resin",
          parent_id: "cat-art-craft",
          name: "Resin Art & Coasters",
          slug: "resin-art",
          description: "Ocean-inspired crystal clear resin home accessories",
          image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
          display_order: 3,
          is_active: true,
        },
      ],
    },
    {
      id: "cat-jewellery",
      parent_id: null,
      name: "Jewellery",
      slug: "jewellery",
      description: "Fine 925 sterling silver, raw gemstones, and artisanal adornments",
      image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      icon_name: "Sparkles",
      display_order: 2,
      is_active: true,
      subcategories: [
        {
          id: "sub-necklaces",
          parent_id: "cat-jewellery",
          name: "Necklaces & Pendants",
          slug: "necklaces-and-pendants",
          description: "Dainty silver chains and semi-precious stone pendants",
          image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
          display_order: 1,
          is_active: true,
        },
        {
          id: "sub-earrings",
          parent_id: "cat-jewellery",
          name: "Handcrafted Earrings",
          slug: "handcrafted-earrings",
          description: "Filigree studs, silver huggies and bohemian drops",
          image_url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80",
          display_order: 2,
          is_active: true,
        },
        {
          id: "sub-bracelets",
          parent_id: "cat-jewellery",
          name: "Bracelets & Bangles",
          slug: "bracelets-and-bangles",
          description: "Braided cord and hammered silver cuff bracelets",
          image_url: "https://images.unsplash.com/photo-1611591475819-79b8b73ff784?auto=format&fit=crop&w=600&q=80",
          display_order: 3,
          is_active: true,
        },
      ],
    },
    {
      id: "cat-home-accessories",
      parent_id: null,
      name: "Home Accessories",
      slug: "home-accessories",
      description: "Soy wax aroma candles, hand-knotted macramé, and sculptural ceramics",
      image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      icon_name: "Home",
      display_order: 3,
      is_active: true,
      subcategories: [
        {
          id: "sub-candles",
          parent_id: "cat-home-accessories",
          name: "Aromatherapy & Candles",
          slug: "candles-and-diffusers",
          description: "Pure soy candles with natural essential oil blends",
          image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
          display_order: 1,
          is_active: true,
        },
        {
          id: "sub-wall-hangings",
          parent_id: "cat-home-accessories",
          name: "Wall Hangings & Macramé",
          slug: "wall-hangings",
          description: "Intricately hand-woven natural cotton wall decor",
          image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
          display_order: 2,
          is_active: true,
        },
        {
          id: "sub-vases",
          parent_id: "cat-home-accessories",
          name: "Ceramic Vases",
          slug: "ceramic-vases",
          description: "Contemporary organic shape ceramic floral vases",
          image_url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80",
          display_order: 3,
          is_active: true,
        },
      ],
    },
  ],
  products: [
    {
      id: "prod-1",
      category_id: "sub-paintings",
      title: "Ethereal Sunset Oil Painting on Canvas (16x20)",
      slug: "ethereal-sunset-oil-painting",
      summary: "One-of-a-kind original textured oil painting on stretched linen canvas.",
      description: "Hand-painted with palette knives by master regional artisans. Employs thick impasto oil strokes capturing the golden warmth of twilight over tranquil mountain waters. Varnished with UV-protective satin finish.",
      price: 2499,
      compare_at_price: 3499,
      stock: 3,
      sku: "EV-ART-OIL01",
      is_featured: true,
      is_published: true,
      rating: 4.9,
      reviews_count: 28,
      images: [
        {
          id: "img-1-1",
          image_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Ethereal Sunset Oil Painting Closeup",
          display_order: 1,
        },
      ],
      attributes: {
        Medium: "Oil on Linen Canvas",
        Dimensions: "16 x 20 inches",
        Framing: "Unframed with gallery-wrapped edges",
        Care: "Dust lightly with a dry feather brush",
      },
    },
    {
      id: "prod-2",
      category_id: "sub-pottery",
      title: "Hand-Thrown Terracotta Ceramic Mug (Set of 2)",
      slug: "hand-thrown-terracotta-ceramic-mug-set",
      summary: "Double-glazed natural clay artisan coffee mugs with thumb-rest handles.",
      description: "Wheel-thrown by studio potters using local alluvial clay. Fired at 1220°C for exceptional durability and heat retention. Features an ergonomic thumb rest and comfortable speckled glazed rim.",
      price: 899,
      compare_at_price: 1299,
      stock: 12,
      sku: "EV-CER-MUG02",
      is_featured: true,
      is_published: true,
      rating: 4.8,
      reviews_count: 45,
      images: [
        {
          id: "img-2-1",
          image_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Hand-Thrown Ceramic Mug Set",
          display_order: 1,
        },
      ],
      attributes: {
        Capacity: "350 ml each",
        Material: "Glazed Stoneware Clay",
        Dishwasher: "Microwave and Dishwasher Safe",
        Quantity: "Set of 2 Mugs",
      },
    },
    {
      id: "prod-3",
      category_id: "sub-resin",
      title: "Ocean Wave Resin Coasters with 24K Gold Leaf (Set of 4)",
      slug: "ocean-wave-resin-coasters-gold-leaf",
      summary: "Multilayer resin coasters recreating aerial shoreline waves with gilded rims.",
      description: "Each coaster features 3 distinct layers of crystal resin with realistic sea foam cells and authentic 24K gold foil flakes embedded inside. Heat resistant up to 90°C with non-scratch silicone foot pads.",
      price: 699,
      compare_at_price: 999,
      stock: 18,
      sku: "EV-RES-CST04",
      is_featured: true,
      is_published: true,
      rating: 5.0,
      reviews_count: 53,
      images: [
        {
          id: "img-3-1",
          image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Ocean Wave Resin Coasters",
          display_order: 1,
        },
      ],
      attributes: {
        Diameter: "4.2 inches each",
        HeatResistance: "Up to 90°C",
        SetSize: "4 Coasters",
      },
    },
    {
      id: "prod-4",
      category_id: "sub-necklaces",
      title: "Sterling Silver Natural Moonstone Pendant Necklace",
      slug: "sterling-silver-moonstone-pendant",
      summary: "Certified 925 sterling silver chain featuring an iridescent natural rainbow moonstone.",
      description: "Handcrafted by hereditary silversmiths. The natural rainbow moonstone flashes celestial blue and violet adularescence under sunlight, perfectly matching the Easyva brand spirit. Anti-tarnish rhodium plated.",
      price: 1899,
      compare_at_price: 2499,
      stock: 7,
      sku: "EV-JWL-NK01",
      is_featured: true,
      is_published: true,
      rating: 4.9,
      reviews_count: 39,
      images: [
        {
          id: "img-4-1",
          image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Moonstone Silver Pendant",
          display_order: 1,
        },
      ],
      attributes: {
        Metal: "Solid 925 Sterling Silver",
        Gemstone: "Natural Rainbow Moonstone (AAA Grade)",
        ChainLength: "18 inches + 2 inch adjustable extender",
        Hallmark: "BIS 925 Stamped",
      },
    },
    {
      id: "prod-5",
      category_id: "sub-earrings",
      title: "Handcrafted Silver Filigree Lotus Dangle Earrings",
      slug: "silver-filigree-lotus-earrings",
      summary: "Featherlight traditional silver filigree floral drops with hypoallergenic ear wires.",
      description: "Crafted through the ancient art of Tarkashi (silver wire twisting). Each petal is hand-formed with micro-twisted pure silver wire, resulting in a mesmerizing lace-like texture that shimmers with movement.",
      price: 1249,
      compare_at_price: 1699,
      stock: 9,
      sku: "EV-JWL-ER02",
      is_featured: false,
      is_published: true,
      rating: 4.9,
      reviews_count: 31,
      images: [
        {
          id: "img-5-1",
          image_url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Silver Filigree Lotus Earrings",
          display_order: 1,
        },
      ],
      attributes: {
        Metal: "925 Pure Silver",
        Weight: "5.8 grams pair (super lightweight)",
        Closure: "French wire hook with safety backer",
      },
    },
    {
      id: "prod-6",
      category_id: "sub-bracelets",
      title: "Handcrafted Macramé & Sterling Silver Bead Adjustable Bracelet",
      slug: "macrame-silver-bead-bracelet",
      summary: "Waterproof waxed micro-cord bracelet with hand-hammered sterling silver beads.",
      description: "Durable Japanese waxed cord intricately knotted with five faceted 925 silver focal beads. Completely waterproof and designed for effortless everyday wear with a smooth sliding knot closure.",
      price: 499,
      compare_at_price: 799,
      stock: 25,
      sku: "EV-JWL-BR03",
      is_featured: false,
      is_published: true,
      rating: 4.7,
      reviews_count: 19,
      images: [
        {
          id: "img-6-1",
          image_url: "https://images.unsplash.com/photo-1611591475819-79b8b73ff784?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Macrame and Silver Bead Bracelet",
          display_order: 1,
        },
      ],
      attributes: {
        Size: "Adjustable from 6 to 9 inches wrist",
        Cord: "Water-resistant braided polyester",
        Accents: "925 Solid Sterling Silver",
      },
    },
    {
      id: "prod-7",
      category_id: "sub-candles",
      title: "French Lavender & Vanilla Organic Soy Wax Aromatherapy Candle",
      slug: "french-lavender-vanilla-soy-candle",
      summary: "Clean-burning non-toxic soy wax candle hand-poured in a reusable amber glass jar.",
      description: "Blended with 100% pure steam-distilled French lavender essential oil and Madagascan vanilla extract. Features lead-free unbleached cotton wicks for a 45+ hour clean soot-free burn that calms the senses.",
      price: 749,
      compare_at_price: 999,
      stock: 14,
      sku: "EV-HOM-CDL01",
      is_featured: true,
      is_published: true,
      rating: 5.0,
      reviews_count: 67,
      images: [
        {
          id: "img-7-1",
          image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Organic Soy Wax Candle",
          display_order: 1,
        },
      ],
      attributes: {
        BurnTime: "45-50 Hours",
        Wax: "100% Non-GMO Soy Wax",
        Vessel: "Reusable 220g Amber Glass with Cork Lid",
      },
    },
    {
      id: "prod-8",
      category_id: "sub-wall-hangings",
      title: "Bohemian Knotted Cotton Macramé Wall Tapestry",
      slug: "bohemian-knotted-cotton-macrame-tapestry",
      summary: "Architectural geometric wall hanging hand-knotted on a natural driftwood rod.",
      description: "Handcrafted from 4mm natural unbleached cotton rope by local women artisans. Brings textural depth, cozy acoustic softening, and organic boho warmth to living rooms, bedrooms, or creative workspaces.",
      price: 1499,
      compare_at_price: 1999,
      stock: 6,
      sku: "EV-HOM-MCR02",
      is_featured: false,
      is_published: true,
      rating: 4.8,
      reviews_count: 22,
      images: [
        {
          id: "img-8-1",
          image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Bohemian Macrame Wall Tapestry",
          display_order: 1,
        },
      ],
      attributes: {
        Dimensions: "18 inches width x 32 inches drop",
        Rod: "Treated organic driftwood branch",
        Material: "100% Recycled Cotton Cord",
      },
    },
    {
      id: "prod-9",
      category_id: "sub-vases",
      title: "Sculptural Matte Ceramic Ribbed Fluted Vase",
      slug: "sculptural-matte-ceramic-ribbed-fluted-vase",
      summary: "Modern architectural vase with vertical fluted texture and matte chalk finish.",
      description: "Hand-cast and hand-finished with a tactile porous matte texture. Designed to look striking on its own as a shelf centerpiece or filled with dried eucalyptus and pampas plumes.",
      price: 1199,
      compare_at_price: 1699,
      stock: 8,
      sku: "EV-HOM-VAS03",
      is_featured: true,
      is_published: true,
      rating: 4.9,
      reviews_count: 18,
      images: [
        {
          id: "img-9-1",
          image_url: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80",
          alt_text: "Sculptural Ribbed Ceramic Vase",
          display_order: 1,
        },
      ],
      attributes: {
        Height: "9.5 inches",
        Finish: "Chalk Matte Sand",
        Waterproof: "Internal glazed lining for fresh florals",
      },
    },
  ],
  orders: [],
  settings: {
    id: "easyva_main",
    store_name: "Easyva",
    store_tagline: "Handcrafted Art, Jewellery & Living Decor",
    merchant_upi_id: "easyva@upi",
    merchant_name: "Easyva Artisan Crafts",
    support_phone: "+91 8072 415 334",
    support_email: "muruganboutiqueandcosmetics@gmail.com",
    store_address: "Coimbatore, Tamil Nadu - 641001, India",
    instagram_url: "https://instagram.com/easyva.artisan",
    whatsapp_number: "+91 8072 415 334",
    announcement_bar: "✨ Free Express Delivery on Prepaid UPI Orders | 100% Handcrafted by Artisans",
    hero_banners: [
      {
        title: "Artisanal Grace & Handcrafted Soul",
        subtitle: "Handmade ceramic pottery, original canvas paintings and fine 925 sterling silver jewelry.",
        image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
        cta_text: "Shop Art & Craft",
        cta_link: "/category/art-and-craft",
      },
      {
        title: "Elegance in Every Detail",
        subtitle: "Timeless handcrafted necklaces, gemstone pendants & minimal sterling silver rings.",
        image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
        cta_text: "Explore Jewellery",
        cta_link: "/category/jewellery",
      },
    ],
    google_search_console_tag: "",
    google_analytics_id: "",
    enable_cod: true,
    custom_upi_qr_url: "",
  },
  blog_posts: [
    {
      id: "blog-1",
      title: "Top 7 Traditional Handicrafts of Tamil Nadu to Elevate Modern Living Rooms",
      slug: "top-traditional-handicrafts-tamil-nadu-home-decor",
      excerpt: "Discover the timeless heritage of Thanjavur art, Swamimalai bronze, Chettinad terracotta pottery, and how ancient artisan crafts seamlessly bring soulful warmth to modern luxury interiors.",
      content: `# Top 7 Traditional Handicrafts of Tamil Nadu to Elevate Modern Living Rooms

Tamil Nadu has long stood as the cradle of South Indian craftsmanship, where ancient temple architecture, spiritual devotion, and artistic virtuosity meet. For discerning homeowners and interior designers seeking authenticity over mass-produced factory decor, handcrafted heritage art offers unmatched textural character, tactile history, and sustainable soul.

Here are the top seven traditional handicrafts of Tamil Nadu that effortlessly enrich contemporary homes with grace and enduring grandeur.

---

## 1. Classical Thanjavur Paintings (Tanjore Art)
Originating in the 16th century under the Maratha rulers of Thanjavur, Tanjore paintings are celebrated worldwide for their surface relief, semi-precious stone embellishments, and meticulous coating of pure **22-karat gold leaf**.

* **Why it works in modern interiors**: A single statement Thanjavur canvas framed in teakwood creates an arresting focal point on a neutral or micro-cement living room wall, radiating subtle twilight warmth when illuminated with warm spot lighting.
* **Artisan Technique**: Master painters spend 40 to 60 days hand-preparing the tamarind-seed gesso relief before carefully applying micron-thin beaten gold foil and vibrant natural pigment dyes.

---

## 2. Swamimalai Bronze Sculptures & Idols
Nestled on the banks of the sacred Kaveri River, Swamimalai is globally renowned for its GI-tagged (Geographical Indication) bronze casting tradition dating back to the Chola dynasty.

* **Living Decor Styling**: A minimal, stylized brass or bronze Nataraja or floral *Agal Vilakku* (deepam platter) displayed on an entryway console table offers immediate architectural balance and quiet meditative poise.
* **The Lost-Wax Process (*Cire Perdue*)**: Every creation begins with a beeswax sculpture that melts away when molten Panchaloha alloy is poured, ensuring that every single piece is truly unique and impossible to duplicate.

---

## 3. Chettinad Terracotta & Handmade Pottery
From the grand palatial courtyards of Chettinad comes a distinct rustic earthiness: hand-thrown terracotta vessels, glazed storage urns, and sculptural water jugs baked in wood-fired kilns.

* **How to Style**: Arrange varying heights of fluted and textured terracotta planters in indoor courtyards, living room corners with fiddle leaf figs, or on minimalist floating shelves.

---

## 4. Madurai Sungudi & Hand-Block Textiles
Crafted by traditional Saurashtrian weavers who settled along the Vaigai river in Madurai, Sungudi involves intricate tie-dye knotting and natural wax resists.

* **Contemporary Application**: Repurpose authentic Sungudi weaves as artisan table runners, throw cushion covers, or framed textile wall hangings to inject vibrant indigo and madder red accents.

---

## 5. Nilgiri Botanical Organic Soy Wax Aromatherapy
Sourced from high-altitude plantations in the Nilgiri hills, artisanal candle-makers blend pure cold-pressed organic soy wax with therapeutic lavender, eucalyptus, and wild vanilla essences.

* **Sensory Ambiance**: Clean-burning, non-GMO candles hand-poured into reusable frosted amber glass vessels that emit zero soot while elevating evening living spaces.

---

## Sustainable Luxury: Supporting Regional Artisan Communities
When you invest in authentic handcrafted pieces directly from regional studios:
- You preserve ancient GI-protected crafts for the next generation.
- You empower master artisans and women-led cooperative guilds across rural Tamil Nadu.
- You bring 100% authentic, non-synthetic soul into your personal living sanctuary.

*Explore our curated collections of handmade paintings, sterling silver jewelry, and aromatherapy living decor delivered safely with comprehensive transit breakage insurance across India.*`,
      cover_image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
      category: "Artisan Traditions",
      tags: ["Tamil Nadu Crafts", "Thanjavur Art", "Home Decor", "Heritage Living", "Handmade India"],
      author_name: "Easyva Editorial Guild",
      author_role: "Heritage & Craft Researcher",
      read_time_minutes: 6,
      is_published: true,
      published_at: "2026-10-29T00:00:00.000Z",
      meta_title: "Top 7 Traditional Handicrafts of Tamil Nadu for Modern Living Rooms | Easyva",
      meta_description: "Discover Thanjavur paintings, Swamimalai bronze, Chettinad terracotta, and Madurai crafts to enrich your modern home. Authentic Tamil Nadu artisan decor guide.",
      meta_keywords: [
        "Tamil Nadu handicrafts",
        "Thanjavur painting online",
        "Chettinad pottery",
        "handcrafted home decor Tamil Nadu",
        "South Indian artisan decor",
        "buy authentic crafts India"
      ],
      primary_keyword: "Tamil Nadu handicrafts",
      secondary_keywords: [
        "Thanjavur painting online",
        "Chettinad pottery",
        "Swamimalai bronze idols",
        "authentic artisan decor",
        "South Indian handmade gifts"
      ],
      canonical_url: "https://easyva.in/blog/top-traditional-handicrafts-tamil-nadu-home-decor",
      faq_items: [
        {
          question: "Are the Thanjavur paintings genuine with real gold foil?",
          answer: "Yes, authentic Thanjavur paintings feature 22-karat beaten gold foil with traditional natural tamarind-seed chalk relief work crafted by certified master artisans."
        },
        {
          question: "How do you care for Swamimalai bronze and brass idols?",
          answer: "Dust gently with a microfibre cloth. For periodic polishing, use a light paste of tamarind pulp or Pitambari with warm water, dry thoroughly, and buff to restore its golden glow."
        },
        {
          question: "Does Easyva provide breakage insurance for fragile ceramics and paintings?",
          answer: "Yes, every fragile terracotta, ceramic, and framed art piece is double-cushioned in eco-friendly honeycomb wrap and heavy-gauge corrugated cartons with 100% transit breakage replacement."
        }
      ]
    }
  ],
  coupons: [
    {
      id: "cpn-1",
      code: "EASYVA10",
      discount_percent: 10,
      min_order_value: 499,
      is_active: true,
      description: "10% off on all artisan creations above ₹499",
    },
    {
      id: "cpn-2",
      code: "FESTIVE20",
      discount_percent: 20,
      min_order_value: 1999,
      is_active: true,
      description: "20% off on special celebration orders above ₹1,999",
    },
  ],
};

// In-memory cache for serverless environments (e.g. Vercel)
let inMemoryStore: StoreData | null = null;
const TMP_DATA_FILE = path.join("/tmp", "easyva_store.json");

/**
 * Ensures the data storage file exists and returns current parsed data.
 * Resilient for local dev and serverless platforms (Vercel read-only filesystem).
 */
async function loadStore(): Promise<StoreData> {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  // 1. Try reading from writable serverless /tmp storage (persists across warm lambdas)
  try {
    const tmpContent = await fs.readFile(TMP_DATA_FILE, "utf-8");
    inMemoryStore = JSON.parse(tmpContent) as StoreData;
    return inMemoryStore;
  } catch {
    // No /tmp file yet, proceed to repository seed data
  }

  // 2. Read bundled data file from repository
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    inMemoryStore = JSON.parse(content) as StoreData;
    return inMemoryStore;
  } catch {
    inMemoryStore = INITIAL_SEED;
    return inMemoryStore;
  }
}

async function saveStore(data: StoreData): Promise<void> {
  inMemoryStore = data;

  // 1. Try saving to local repo data directory (development / local server)
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return;
  } catch {
    // Read-only filesystem on serverless platforms (e.g. Vercel / AWS Lambda)
  }

  // 2. Fallback to /tmp directory (writable in serverless execution environments)
  try {
    await fs.writeFile(TMP_DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to serverless /tmp cache:", err);
  }
}

// -------------------------------------------------------------------------
// DATABASE ADAPTER METHODS (Local file + Supabase dual-mode)
// -------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const store = await loadStore();
  return store.categories.filter((c) => c.is_active);
}

export async function getAllCategoriesIncludingInactive(): Promise<Category[]> {
  const store = await loadStore();
  return store.categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const store = await loadStore();
  // Search in root categories
  for (const cat of store.categories) {
    if (cat.slug === slug) return cat;
    // Search in subcategories
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        if (sub.slug === slug) return sub;
      }
    }
  }
  return null;
}

export async function getProducts(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  searchQuery?: string;
}): Promise<Product[]> {
  const store = await loadStore();
  let items = store.products.filter((p) => p.is_published);

  if (options?.isFeatured !== undefined) {
    items = items.filter((p) => p.is_featured === options.isFeatured);
  }

  if (options?.categorySlug) {
    const slug = options.categorySlug;
    // Find matching category or subcategories
    const matchingCategory = await getCategoryBySlug(slug);
    if (matchingCategory) {
      const allowedCategoryIds = new Set<string>([matchingCategory.id]);
      if (matchingCategory.subcategories) {
        matchingCategory.subcategories.forEach((sub) => allowedCategoryIds.add(sub.id));
      }
      items = items.filter((p) => allowedCategoryIds.has(p.category_id));
    }
  }

  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q)
    );
  }

  return items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const store = await loadStore();
  const product = store.products.find((p) => p.slug === slug);
  return product || null;
}

export async function createOrder(
  orderData: Omit<Order, "id" | "created_at">
): Promise<Order> {
  const store = await loadStore();
  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  store.orders.unshift(newOrder);
  await saveStore(store);
  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
  const store = await loadStore();
  return store.orders;
}

export async function getOrdersByCustomer(lookup: string): Promise<Order[]> {
  const store = await loadStore();
  const clean = lookup.trim().toLowerCase();
  return store.orders.filter(
    (o) =>
      (o.customer_id && o.customer_id.toLowerCase() === clean) ||
      (o.customer_email && o.customer_email.toLowerCase() === clean) ||
      (o.customer_phone && o.customer_phone.includes(clean))
  );
}

export async function getCustomerAddresses(customerIdOrEmail: string): Promise<CustomerAddress[]> {
  const store = await loadStore();
  if (!store.addresses) return [];
  const clean = customerIdOrEmail.trim().toLowerCase();
  return store.addresses.filter(
    (a) => (a.customer_id && a.customer_id.toLowerCase() === clean)
  );
}

export async function saveCustomerAddress(address: CustomerAddress): Promise<CustomerAddress> {
  const store = await loadStore();
  if (!store.addresses) store.addresses = [];
  if (address.is_default) {
    store.addresses.forEach((a) => {
      if (a.customer_id === address.customer_id) a.is_default = false;
    });
  }
  const idx = store.addresses.findIndex((a) => a.id === address.id);
  if (idx > -1) {
    store.addresses[idx] = address;
  } else {
    store.addresses.push(address);
  }
  await saveStore(store);
  return address;
}

export async function deleteCustomerAddress(addressId: string): Promise<boolean> {
  const store = await loadStore();
  if (!store.addresses) return true;
  store.addresses = store.addresses.filter((a) => a.id !== addressId);
  await saveStore(store);
  return true;
}

export async function getOrderByLookup(lookup: string): Promise<Order | null> {
  const store = await loadStore();
  const clean = lookup.trim().toLowerCase();
  const order = store.orders.find(
    (o) =>
      o.order_number.toLowerCase() === clean ||
      o.customer_phone.includes(clean) ||
      o.id.toLowerCase() === clean
  );
  return order || null;
}

export async function getCoupons(): Promise<Coupon[]> {
  const store = await loadStore();
  return store.coupons || [];
}

export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  const store = await loadStore();
  if (!store.coupons) store.coupons = [];
  const idx = store.coupons.findIndex((c) => c.id === coupon.id);
  if (idx > -1) {
    store.coupons[idx] = coupon;
  } else {
    store.coupons.push(coupon);
  }
  await saveStore(store);
  return coupon;
}

export async function updateOrderStatus(
  orderId: string,
  updates: {
    payment_status?: Order["payment_status"];
    fulfillment_status?: Order["fulfillment_status"];
    tracking_number?: string;
    utr_number?: string;
    utr_proof_image?: string;
  }
): Promise<Order | null> {
  const store = await loadStore();
  const index = store.orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  store.orders[index] = {
    ...store.orders[index],
    ...updates,
  };

  await saveStore(store);
  return store.orders[index];
}

export async function getBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  const store = await loadStore();
  const posts = store.blog_posts || [];
  if (includeUnpublished) return posts;
  return posts.filter((p) => p.is_published);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const store = await loadStore();
  const posts = store.blog_posts || [];
  const clean = slug.toLowerCase().trim();
  const post = posts.find((p) => p.slug.toLowerCase().trim() === clean);
  return post || null;
}

export async function saveBlogPost(post: BlogPost): Promise<BlogPost> {
  const store = await loadStore();
  if (!store.blog_posts) store.blog_posts = [];
  const idx = store.blog_posts.findIndex((p) => p.id === post.id);
  if (idx > -1) {
    store.blog_posts[idx] = post;
  } else {
    store.blog_posts.unshift(post);
  }
  await saveStore(store);
  return post;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const store = await loadStore();
  if (!store.blog_posts) return true;
  store.blog_posts = store.blog_posts.filter((p) => p.id !== id);
  await saveStore(store);
  return true;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const store = await loadStore();
  return store.settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = await loadStore();
  store.settings = {
    ...store.settings,
    ...settings,
  };
  await saveStore(store);
  return store.settings;
}

export async function saveProduct(product: Product): Promise<Product> {
  const store = await loadStore();
  const index = store.products.findIndex((p) => p.id === product.id);
  if (index > -1) {
    store.products[index] = product;
  } else {
    store.products.unshift(product);
  }
  await saveStore(store);
  return product;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const store = await loadStore();
  store.products = store.products.filter((p) => p.id !== productId);
  await saveStore(store);
  return true;
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
  const store = await loadStore();
  // Check if root category
  store.categories = store.categories.filter((c) => c.id !== categoryId);

  // Also check subcategories
  store.categories.forEach((cat) => {
    if (cat.subcategories) {
      cat.subcategories = cat.subcategories.filter((s) => s.id !== categoryId);
    }
  });

  await saveStore(store);
  return true;
}

export async function saveCategory(category: Category): Promise<Category> {
  const store = await loadStore();
  if (category.parent_id) {
    // It's a subcategory
    const parent = store.categories.find((c) => c.id === category.parent_id);
    if (parent) {
      if (!parent.subcategories) parent.subcategories = [];
      const subIdx = parent.subcategories.findIndex((s) => s.id === category.id);
      if (subIdx > -1) {
        parent.subcategories[subIdx] = category;
      } else {
        parent.subcategories.push(category);
      }
    }
  } else {
    // Root category
    const index = store.categories.findIndex((c) => c.id === category.id);
    if (index > -1) {
      store.categories[index] = { ...category, subcategories: store.categories[index].subcategories || [] };
    } else {
      store.categories.push({ ...category, subcategories: category.subcategories || [] });
    }
  }
  await saveStore(store);
  return category;
}

export async function deleteCoupon(couponIdOrCode: string): Promise<boolean> {
  const store = await loadStore();
  if (store.coupons) {
    store.coupons = store.coupons.filter(
      (c) => c.id !== couponIdOrCode && c.code.toLowerCase() !== couponIdOrCode.toLowerCase()
    );
    await saveStore(store);
  }
  return true;
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const store = await loadStore();
  store.orders = store.orders.filter((o) => o.id !== orderId && o.order_number !== orderId);
  await saveStore(store);
  return true;
}


