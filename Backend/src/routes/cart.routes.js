import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addToCartController, createOrderController, getCart, getOrdersController, removeFromCartController, updateCartItemQuantityController, verifyOrderController } from "../controllers/cart.controller.js";
import { validateAddToCart, validateIncrementCartItemQuantity } from "../validators/cart.validator.js";

const cartRouter = express.Router();

cartRouter.post("/add/:productId/:variantId", protect, validateAddToCart, addToCartController);
cartRouter.get("/", protect, getCart);
cartRouter.delete("/remove/:productId/:variantId", protect, removeFromCartController);
cartRouter.put("/update/:productId/:variantId", protect, validateIncrementCartItemQuantity, updateCartItemQuantityController);
cartRouter.post("/payment/create/order", protect, createOrderController);
cartRouter.post("/payment/verify/order", protect, verifyOrderController);
cartRouter.get("/orders", protect, getOrdersController);

export default cartRouter;