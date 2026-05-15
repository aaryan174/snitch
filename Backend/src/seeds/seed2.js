/**
 * Seed script v2 — adds 16 more products (multi-image + rich variants)
 *
 * Usage:
 *   $env:SELLER_ID="<your-seller-id>"; node --env-file=.env src/seeds/seed2.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { default: productModel } = await import("../models/product.model.js");

const SELLER_ID = process.env.SELLER_ID;
if (!SELLER_ID) {
  console.error("❌  SELLER_ID is not set.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log("✅  MongoDB connected");

const S = new mongoose.Types.ObjectId(SELLER_ID);

const products = [

  // ─── SHIRTS ───────────────────────────────────────────────────────────────
  {
    title: "Washed Oversized Flannel",
    description: "Stone-washed cotton flannel in a relaxed, drop-shoulder fit. Brushed interior for warmth, chest patch pocket, and a curved hem. A wardrobe cornerstone for transitional dressing.",
    category: "SHIRTS",
    prize: { amount: 1599, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80" },
    ],
    variants: [
      { stock: 40, attributes: new Map([["size","S"]]),  price: { amount: 1599, currency: "INR" } },
      { stock: 55, attributes: new Map([["size","M"]]),  price: { amount: 1599, currency: "INR" } },
      { stock: 45, attributes: new Map([["size","L"]]),  price: { amount: 1599, currency: "INR" } },
      { stock: 30, attributes: new Map([["size","XL"]]), price: { amount: 1599, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","XXL"]]),price: { amount: 1699, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Relaxed Linen Shirt",
    description: "Premium 100% linen shirt with a relaxed cut, barrel cuffs, and a one-button collar. Breathable and lightweight — built for the heat but polished enough for dinner.",
    category: "SHIRTS",
    prize: { amount: 1899, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80" },
    ],
    variants: [
      { stock: 30, attributes: new Map([["size","S"]]),  price: { amount: 1899, currency: "INR" } },
      { stock: 40, attributes: new Map([["size","M"]]),  price: { amount: 1899, currency: "INR" } },
      { stock: 35, attributes: new Map([["size","L"]]),  price: { amount: 1899, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","XL"]]), price: { amount: 1899, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Tie-Dye Streetwear Tee",
    description: "Hand-dyed spiral tie-dye tee on a heavyweight 240gsm cotton base. Each piece is unique — no two are the same. One of a kind is the whole point.",
    category: "TRENDING",
    prize: { amount: 1199, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80" },
    ],
    variants: [
      { stock: 20, attributes: new Map([["size","S"]]),  price: { amount: 1199, currency: "INR" } },
      { stock: 30, attributes: new Map([["size","M"]]),  price: { amount: 1199, currency: "INR" } },
      { stock: 25, attributes: new Map([["size","L"]]),  price: { amount: 1199, currency: "INR" } },
      { stock: 18, attributes: new Map([["size","XL"]]), price: { amount: 1199, currency: "INR" } },
    ],
    seller: S
  },

  // ─── JACKETS ──────────────────────────────────────────────────────────────
  {
    title: "Fleece Zip Hoodie",
    description: "Heavyweight 380gsm polar fleece zip-up hoodie. Oversized fit with a deep hood, kangaroo pocket, and side zip pockets. The essential cold-weather layer.",
    category: "JACKETS",
    prize: { amount: 2899, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80" },
    ],
    variants: [
      { stock: 22, attributes: new Map([["size","S"]]),  price: { amount: 2899, currency: "INR" } },
      { stock: 35, attributes: new Map([["size","M"]]),  price: { amount: 2899, currency: "INR" } },
      { stock: 30, attributes: new Map([["size","L"]]),  price: { amount: 2899, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","XL"]]), price: { amount: 2999, currency: "INR" } },
      { stock: 12, attributes: new Map([["size","XXL"]]),price: { amount: 2999, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Tactical Field Jacket",
    description: "Military-inspired field jacket in a DWR-treated ripstop shell. Features an adjustable hood, four flap pockets, underarm vents, and a packable design. Functional streetwear.",
    category: "JACKETS",
    prize: { amount: 5499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80" },
    ],
    variants: [
      { stock: 12, attributes: new Map([["size","S"]]),  price: { amount: 5499, currency: "INR" } },
      { stock: 18, attributes: new Map([["size","M"]]),  price: { amount: 5499, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","L"]]),  price: { amount: 5499, currency: "INR" } },
      { stock: 10, attributes: new Map([["size","XL"]]), price: { amount: 5499, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Leather Biker Jacket",
    description: "Genuine cowhide leather biker jacket with an asymmetric zip, zip cuffs, and a belted waist. Fully lined with a YKK zipper. An icon built to outlast trends.",
    category: "NEW ARRIVALS",
    prize: { amount: 12999, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800&q=80" },
    ],
    variants: [
      { stock: 5,  attributes: new Map([["size","S"]]),  price: { amount: 12999, currency: "INR" } },
      { stock: 8,  attributes: new Map([["size","M"]]),  price: { amount: 12999, currency: "INR" } },
      { stock: 6,  attributes: new Map([["size","L"]]),  price: { amount: 12999, currency: "INR" } },
      { stock: 4,  attributes: new Map([["size","XL"]]), price: { amount: 12999, currency: "INR" } },
    ],
    seller: S
  },

  // ─── JEANS ────────────────────────────────────────────────────────────────
  {
    title: "Tapered Cargo Pants",
    description: "Cotton-ripstop tapered cargo pants with six utility pockets, adjustable ankle cuffs, and a clean, modern taper. A versatile staple that blends utility with style.",
    category: "JEANS",
    prize: { amount: 2499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80" },
    ],
    variants: [
      { stock: 25, attributes: new Map([["size","28"]]), price: { amount: 2499, currency: "INR" } },
      { stock: 30, attributes: new Map([["size","30"]]), price: { amount: 2499, currency: "INR" } },
      { stock: 28, attributes: new Map([["size","32"]]), price: { amount: 2499, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","34"]]), price: { amount: 2499, currency: "INR" } },
      { stock: 10, attributes: new Map([["size","36"]]), price: { amount: 2499, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Vintage Straight Jeans",
    description: "Rigid 12oz denim in a classic straight cut. A vintage wash finish and subtle whiskering give each pair character from day one. Designed to age with you.",
    category: "JEANS",
    prize: { amount: 2999, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1565084888279-aca607bb6f42?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&q=80" },
    ],
    variants: [
      { stock: 18, attributes: new Map([["size","28"]]), price: { amount: 2999, currency: "INR" } },
      { stock: 22, attributes: new Map([["size","30"]]), price: { amount: 2999, currency: "INR" } },
      { stock: 25, attributes: new Map([["size","32"]]), price: { amount: 2999, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","34"]]), price: { amount: 2999, currency: "INR" } },
    ],
    seller: S
  },

  // ─── SNEAKERS ─────────────────────────────────────────────────────────────
  {
    title: "Retro High-Top Basketball",
    description: "Retro-silhouette high-top with a premium suede upper, EVA midsole, and herringbone rubber outsole. Iconic profile reimagined for modern streetwear sensibilities.",
    category: "SNEAKERS",
    prize: { amount: 8499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80" },
    ],
    variants: [
      { stock: 8,  attributes: new Map([["size","6"]]),  price: { amount: 8499, currency: "INR" } },
      { stock: 12, attributes: new Map([["size","7"]]),  price: { amount: 8499, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","8"]]),  price: { amount: 8499, currency: "INR" } },
      { stock: 18, attributes: new Map([["size","9"]]),  price: { amount: 8499, currency: "INR" } },
      { stock: 10, attributes: new Map([["size","10"]]), price: { amount: 8499, currency: "INR" } },
      { stock: 6,  attributes: new Map([["size","11"]]), price: { amount: 8499, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Slip-On Skate Shoe",
    description: "Classic canvas slip-on skate shoe with a padded collar, waffle outsole for grip, and a reinforced toe cap for durability. The effortless off-duty staple.",
    category: "SNEAKERS",
    prize: { amount: 3499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80" },
    ],
    variants: [
      { stock: 20, attributes: new Map([["size","6"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 25, attributes: new Map([["size","7"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 30, attributes: new Map([["size","8"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 22, attributes: new Map([["size","9"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","10"]]), price: { amount: 3499, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Technical Trail Runner",
    description: "All-terrain trail runner with a TPU rock plate, Vibram outsole, and a moisture-wicking engineered mesh upper. From city blocks to mountain trails.",
    category: "TRENDING",
    prize: { amount: 9999, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80" },
    ],
    variants: [
      { stock: 10, attributes: new Map([["size","7"]]),  price: { amount: 9999, currency: "INR" } },
      { stock: 14, attributes: new Map([["size","8"]]),  price: { amount: 9999, currency: "INR" } },
      { stock: 16, attributes: new Map([["size","9"]]),  price: { amount: 9999, currency: "INR" } },
      { stock: 12, attributes: new Map([["size","10"]]), price: { amount: 9999, currency: "INR" } },
      { stock: 8,  attributes: new Map([["size","11"]]), price: { amount: 9999, currency: "INR" } },
    ],
    seller: S
  },

  // ─── ACCESSORIES ──────────────────────────────────────────────────────────
  {
    title: "Leather Card Wallet",
    description: "Slim card wallet in full-grain vegetable-tanned leather with 6 card slots, a centre note compartment, and a pull tab for easy access. Gets better with age.",
    category: "ACCESSORIES",
    prize: { amount: 1299, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" },
    ],
    variants: [
      { stock: 80, attributes: new Map([["color","Black"]]),  price: { amount: 1299, currency: "INR" } },
      { stock: 60, attributes: new Map([["color","Tan"]]),    price: { amount: 1299, currency: "INR" } },
      { stock: 40, attributes: new Map([["color","Brown"]]),  price: { amount: 1299, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Wide-Brim Bucket Hat",
    description: "Wide-brim bucket hat in water-resistant nylon ripstop. Packable design with an adjustable chin cord and a moisture-wicking sweatband. Sun protection meets street cred.",
    category: "ACCESSORIES",
    prize: { amount: 899, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1533055640609-24b498dfd74c?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80" },
    ],
    variants: [
      { stock: 60, attributes: new Map([["size","S/M"]]), price: { amount: 899, currency: "INR" } },
      { stock: 60, attributes: new Map([["size","L/XL"]]),price: { amount: 899, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Webbing Belt",
    description: "Military-spec 38mm webbing belt with a brushed gunmetal box buckle. Fully adjustable and trimmed to size. A minimal essential that locks every look together.",
    category: "ACCESSORIES",
    prize: { amount: 549, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1591782600020-32e6c0e07b4c?w=800&q=80" },
    ],
    variants: [
      { stock: 100, attributes: new Map([["size","One Size"]]), price: { amount: 549, currency: "INR" } },
    ],
    seller: S
  },

  // ─── NEW ARRIVALS ─────────────────────────────────────────────────────────
  {
    title: "Ribbed Knit Cardigan",
    description: "Heavy-gauge ribbed knit cardigan in a premium merino-acrylic blend. Features a relaxed drape, deep set-in pockets, and subtle tonal buttons. The premium layer.",
    category: "NEW ARRIVALS",
    prize: { amount: 3499, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80" },
    ],
    variants: [
      { stock: 20, attributes: new Map([["size","S"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 25, attributes: new Map([["size","M"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 20, attributes: new Map([["size","L"]]),  price: { amount: 3499, currency: "INR" } },
      { stock: 15, attributes: new Map([["size","XL"]]), price: { amount: 3699, currency: "INR" } },
    ],
    seller: S
  },
  {
    title: "Monogram Tote Bag",
    description: "Structured canvas tote with a printed monogram allover pattern, leather-wrapped handles, a magnetic snap closure, and an internal zip pocket. Statement carry.",
    category: "NEW ARRIVALS",
    prize: { amount: 2199, currency: "INR" },
    image: [
      { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80" },
      { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80" },
    ],
    variants: [
      { stock: 45, attributes: new Map([["color","Black"]]), price: { amount: 2199, currency: "INR" } },
      { stock: 35, attributes: new Map([["color","Cream"]]), price: { amount: 2199, currency: "INR" } },
    ],
    seller: S
  },
];

await productModel.insertMany(products);
console.log(`✅  Seeded ${products.length} more products.`);
await mongoose.disconnect();
console.log("🔌  Done.");
