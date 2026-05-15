import express from "express";
import { sellerCheckMiddleware } from "../middlewares/seller.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createProductValidator } from "../validators/product.validate.js";
import multer from 'multer'
import {
  createProductController,
  createVariantController,
  getProductUserData,
  getSellerData,
  updateProductController,
  updateVariantController
} from "../controllers/product.controller.js";

const productRouter = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fieldSize: 5 * 1024 * 1024 }
});

productRouter.post("/create", sellerCheckMiddleware, upload.array("image", 7), createProductValidator, validate, createProductController);
productRouter.put("/:productId", sellerCheckMiddleware, upload.array("image", 7), updateProductController);

productRouter.get("/seller", sellerCheckMiddleware, getSellerData);
productRouter.get("/", getProductUserData);

productRouter.post("/:productId/variants", sellerCheckMiddleware, upload.array('images', 7), createVariantController);
productRouter.put("/:productId/variants/:variantId", sellerCheckMiddleware, upload.array('images', 7), updateVariantController);

export default productRouter;