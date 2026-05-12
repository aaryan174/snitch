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
  const products = await productModel.find()

  return res.status(200).json({
    message: "Products fetched successfully",
    success: true,
    products
  })
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