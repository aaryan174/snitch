/**
 * Seed script — inserts 12 dummy streetwear products into MongoDB
 *
 * Usage:
 *   node --env-file=.env src/seeds/seed.js
 *   OR  set MONGO_URI and SELLER_ID in .env, then run via npm run seed
 *
 * SELLER_ID must be a valid MongoDB ObjectId of an existing seller account.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// ─── Import model AFTER dotenv so env vars are available ────────────────────
const { default: productModel } = await import("../models/product.model.js");

const SELLER_ID = process.env.SELLER_ID;
if (!SELLER_ID) {
  console.error("❌  SELLER_ID is not set in .env — add your seller account's _id.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log("✅  MongoDB connected");

const products = [
  // ─── SHIRTS ───────────────────────────────────────────────────────────────
  {
    title: "Oversized Graphic Tee",
    description: "A premium heavyweight cotton tee with a bold editorial graphic print. Drop-shoulder fit, ribbed collar, and a brushed interior for unmatched comfort. The staple piece for any streetwear wardrobe.",
    category: "SHIRTS",
    prize: { amount: 999, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80" },
    ],
    variants: [
      { stock: 50, attributes: new Map([["size","S"]]), price: { amount: 999, currency: "INR" } },
      { stock: 60, attributes: new Map([["size","M"]]), price: { amount: 999, currency: "INR" } },
      { stock: 40, attributes: new Map([["size","L"]]), price: { amount: 999, currency: "INR" } },
      { stock: 30, attributes: new Map([["size","XL"]]), price: { amount: 999, currency: "INR" } },
    ]
  },
  {
    title: "Acid Wash Polo",
    description: "Vintage-inspired acid wash polo with a relaxed fit. Features a two-button placket, ribbed cuffs, and an embroidered micro-logo at the chest. Elevated casual at its finest.",
    category: "SHIRTS",
    prize: { amount: 1299, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80" },
    ],
    variants: [
      { stock: 25, attributes: new Map([["size","S"]]), price: { amount: 1299, currency: "INR" } },
      { stock: 35, attributes: new Map([["size","M"]]), price: { amount: 1299, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","L"]]), price: { amount: 1299, currency: "INR" } },
    ]
  },
  {
    title: "Minimal Logo Shirt",
    description: "Clean-cut regular fit shirt in premium 200-gsm cotton. Tonal embroidery logo on the left chest. A versatile essential that transitions effortlessly from day to night.",
    category: "NEW ARRIVALS",
    prize: { amount: 799, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80" },
    ],
    variants: [
      { stock: 80, attributes: new Map([["size","M"]]), price: { amount: 799, currency: "INR" } },
      { stock: 60, attributes: new Map([["size","L"]]), price: { amount: 799, currency: "INR" } },
      { stock: 40, attributes: new Map([["size","XL"]]), price: { amount: 799, currency: "INR" } },
    ]
  },

  // ─── JACKETS ──────────────────────────────────────────────────────────────
  {
    title: "Varsity Bomber Jacket",
    description: "Wool-blend varsity jacket with contrasting leather sleeves, ribbed hem, and snap-button closure. Chenille logo patch on the back. Lined interior for warmth without the bulk.",
    category: "JACKETS",
    prize: { amount: 4499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80" },
    ],
    variants: [
      { stock: 15, attributes: new Map([["size","S"]]), price: { amount: 4499, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","M"]]), price: { amount: 4499, currency: "INR" } },
      { stock: 18, attributes: new Map([["size","L"]]), price: { amount: 4499, currency: "INR" } },
    ]
  },
  {
    title: "Utility Cargo Jacket",
    description: "Washed canvas utility jacket with six external pockets, adjustable waist tabs, and a removable hood. The go-to layering piece for any urban explorer.",
    category: "JACKETS",
    prize: { amount: 3299, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80" },
    ],
    variants: [
      { stock: 10, attributes: new Map([["size","M"]]), price: { amount: 3299, currency: "INR" } },
      { stock: 14, attributes: new Map([["size","L"]]), price: { amount: 3299, currency: "INR" } },
      { stock: 8,  attributes: new Map([["size","XL"]]), price: { amount: 3299, currency: "INR" } },
    ]
  },

  // ─── JEANS ────────────────────────────────────────────────────────────────
  {
    title: "Slim Fit Raw Denim",
    description: "Japanese selvedge raw denim with a slim-tapered leg. 14oz weight with a natural indigo fade over time. Copper rivets and a hidden coin pocket for a heritage feel.",
    category: "JEANS",
    prize: { amount: 2799, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
    ],
    variants: [
      { stock: 20, attributes: new Map([["size","30"]]), price: { amount: 2799, currency: "INR" } },
      { stock: 25, attributes: new Map([["size","32"]]), price: { amount: 2799, currency: "INR" } },
      { stock: 18, attributes: new Map([["size","34"]]), price: { amount: 2799, currency: "INR" } },
    ]
  },
  {
    title: "Baggy Street Denim",
    description: "90s-inspired baggy denim with a high rise and wide-straight leg. Acid wash distressing and chain stitching at the hem. Pairs perfectly with chunky sneakers.",
    category: "TRENDING",
    prize: { amount: 2299, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=80" },
    ],
    variants: [
      { stock: 30, attributes: new Map([["size","30"]]), price: { amount: 2299, currency: "INR" } },
      { stock: 35, attributes: new Map([["size","32"]]), price: { amount: 2299, currency: "INR" } },
      { stock: 22, attributes: new Map([["size","34"]]), price: { amount: 2299, currency: "INR" } },
    ]
  },

  // ─── SNEAKERS ─────────────────────────────────────────────────────────────
  {
    title: "Court Low Sneaker",
    description: "Premium leather low-top sneaker with a vulcanized rubber sole. Clean tonal colorway with a padded collar, perforated toe cap, and waxed laces. The minimalist flex.",
    category: "SNEAKERS",
    prize: { amount: 5999, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80" },
    ],
    variants: [
      { stock: 10, attributes: new Map([["size","7"]]),  price: { amount: 5999, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","8"]]),  price: { amount: 5999, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","9"]]),  price: { amount: 5999, currency: "INR" } },
      { stock: 12, attributes: new Map([["size","10"]]), price: { amount: 5999, currency: "INR" } },
    ]
  },
  {
    title: "Chunky Platform Runner",
    description: "Oversized chunky sole running shoe with an engineered mesh upper and triple-layered EVA midsole. Maximalist silhouette meets everyday comfort.",
    category: "TRENDING",
    prize: { amount: 7499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80" },
    ],
    variants: [
      { stock: 8,  attributes: new Map([["size","7"]]),  price: { amount: 7499, currency: "INR" } },
      { stock: 12, attributes: new Map([["size","8"]]),  price: { amount: 7499, currency: "INR" } },
      { stock: 14, attributes: new Map([["size","9"]]),  price: { amount: 7499, currency: "INR" } },
      { stock: 10, attributes: new Map([["size","10"]]), price: { amount: 7499, currency: "INR" } },
    ]
  },

  // ─── ACCESSORIES ──────────────────────────────────────────────────────────
  {
    title: "Structured 6-Panel Cap",
    description: "Six-panel structured cap in premium twill with an adjustable strap-back closure. Embroidered SNITCH wordmark at the front panel. Low-profile, versatile, essential.",
    category: "ACCESSORIES",
    prize: { amount: 699, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80" },
    ],
    variants: [
      { stock: 100, attributes: new Map([["size","One Size"]]), price: { amount: 699, currency: "INR" } },
    ]
  },
  {
    title: "Crossbody Utility Bag",
    description: "Compact crossbody bag in water-resistant ripstop nylon. Features a main compartment, two exterior zip pockets, and an adjustable webbing strap. City-ready carry.",
    category: "ACCESSORIES",
    prize: { amount: 1499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" },
    ],
    variants: [
      { stock: 40, attributes: new Map([["size","One Size"]]), price: { amount: 1499, currency: "INR" } },
    ]
  },
  {
    title: "Knit Beanie",
    description: "Fine-knit ribbed beanie in a premium acrylic-wool blend. Slightly slouched silhouette with a folded cuff. Tonal woven label at the inner band. Winter essential.",
    category: "NEW ARRIVALS",
    prize: { amount: 499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80" },
    ],
    variants: [
      { stock: 120, attributes: new Map([["size","One Size"]]), price: { amount: 499, currency: "INR" } },
    ]
  },
];

// Attach sellerId to every product
const withSeller = products.map(p => ({ ...p, seller: new mongoose.Types.ObjectId(SELLER_ID) }));

await productModel.insertMany(withSeller);
console.log(`✅  Seeded ${withSeller.length} products successfully.`);

await mongoose.disconnect();
console.log("🔌  Disconnected from MongoDB");
