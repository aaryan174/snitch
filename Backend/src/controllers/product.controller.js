import { json } from "express";
import productModel from "../models/product.model.js";
import { uploadImage } from "../Services/storage.service.js";


export async function createProductController(req, res) {

  try {
    const { title, description, image, prizeAmount, prizeCurrency } = req.body;
    const seller = req.user;

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(req.files.map(async (file) => {
        const result = await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname
        })
        return result;
      }));
    }

    const sizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
    const variants = sizes.map(s => ({
      stock: Number(s.stock) || 0,
      attributes: { size: s.size }
    }));

    const product = await productModel.create({
      title,
      description,
      prize: {
        amount: prizeAmount,
        currency: prizeCurrency || "INR"
      },
      image: uploadedImages.map(img => ({ url: img.url })),
      seller: seller._id,
      variants
    });

    res.status(201).json({
      message: "product created successfully",
      success: true,
      product
    });

  } catch (error) {
    console.log(" Product error", error.message);
    return res.status(500).json({
      message: "Server error",
      err: "Server error",
      success: false
    })
  }
}


export const getSellerData = async (req, res) => {
  const seller = req.user;
  try {

    if (!seller) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
        err: "Unauthorized"
      })
    }

    const products = await productModel.find({ seller: seller._id });
    res.status(200).json({
      message: "product fetched successfully",
      success: true,
      products
    })

  } catch (error) {
    console.log("sellerData Error", error.message);
    return res.status(500).json({
      message: "Server error",
      success: false,
      err: "server error"
    })
  }
}

export const getProductUserData = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 8 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(20, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      productModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      productModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
      pagination: {
        currentPage:   pageNum,
        totalPages:    Math.ceil(totalProducts / limitNum),
        totalProducts,
        limit:         limitNum,
      }
    });
  } catch (error) {
    console.log("getProductUserData error", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const getOneProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "ProductId not found",
        success: false
      });
    }
    const Product = await productModel.findById(productId).lean();

    if (!Product) {
      return res.status(400).json({
        message: "Product not found",
        success: false
      });
    }

    res.status(200).json({
      message: "Product data fetched successfully",
      success: true,
      Product
    });
  } catch (error) {
    console.log("Server Error", error.message);
    return res.status(500).json({
      message: "Server Error",
      success: false
    });
  }
}

export const createVariantController = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
      return res.status(400).json({
        message: "ProductId not found",
        success: false
      });
    }

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized",
        success: false
      });
    }

    const files = req.files;
    let images = [];
    if (files && files.length !== 0) {
      const uploadedImages = await Promise.all(files.map(async (file) => {
        const image = await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname
        });
        return image;
      }));
      images = uploadedImages.map(img => ({ url: img.url }));
    }
   
    const priceAmount = req.body.priceAmount;
    const stock = req.body.stock;
    const attributes = JSON.parse(req.body.attributes || "{}");

    const newVariant = {
      images,
      stock: Number(stock) || 0,
      attributes,
    };

    if (priceAmount) {
      newVariant.price = {
        amount: Number(priceAmount),
        currency: product.prize?.currency || "INR"
      };
    }

    product.variants.push(newVariant);
    await product.save();

    res.status(201).json({
      message: "Variant created successfully",
      success: true,
      product
    });

  } catch (error) {
    console.log("Variant Error", error.message);
    res.status(500).json({
      message: "Server Error",
      success: false
    });
  }
}

// ─── Edit Product ─────────────────────────────────────────────────────────────

export const updateProductController = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized", success: false });
    }

    const { title, description, prizeAmount, prizeCurrency } = req.body;

    if (title)       product.title       = title;
    if (description) product.description = description;
    if (prizeAmount) {
      product.prize = {
        amount:   Number(prizeAmount),
        currency: prizeCurrency || product.prize?.currency || "INR"
      };
    }

    // Append any new images (don't delete existing ones)
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(req.files.map(file =>
        uploadImage({ buffer: file.buffer, fileName: file.originalname })
      ));
      product.image.push(...uploaded.map(img => ({ url: img.url })));
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product
    });
  } catch (error) {
    console.log("Update product error", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

// ─── Edit Variant ─────────────────────────────────────────────────────────────

export const updateVariantController = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized", success: false });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found", success: false });
    }

    const { priceAmount, priceCurrency, stock, attributes } = req.body;

    if (stock    !== undefined) variant.stock = Number(stock);
    if (priceAmount !== undefined) {
      variant.price = {
        amount:   Number(priceAmount),
        currency: priceCurrency || variant.price?.currency || product.prize?.currency || "INR"
      };
    }
    if (attributes) {
      const parsed = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
      variant.attributes = parsed;
    }

    // Append new images to variant
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(req.files.map(file =>
        uploadImage({ buffer: file.buffer, fileName: file.originalname })
      ));
      variant.images.push(...uploaded.map(img => ({ url: img.url })));
    }

    await product.save();

    return res.status(200).json({
      message: "Variant updated successfully",
      success: true,
      product
    });
  } catch (error) {
    console.log("Update variant error", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
}
