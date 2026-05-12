import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { addToCartController, getCart, removeFromCartController, updateCartItemQuantityController } from "../controllers/cart.controller.js";
import { validateAddToCart, validateIncrementCartItemQuantity } from "../validators/cart.validator.js";

const cartRouter = express.Router();

cartRouter.post("/add/:productId/:variantId", protect, validateAddToCart, addToCartController);
cartRouter.get("/", protect, getCart);
cartRouter.delete("/remove/:productId/:variantId", protect, removeFromCartController);
cartRouter.put("/update/:productId/:variantId", protect, validateIncrementCartItemQuantity, updateCartItemQuantityController);

export default cartRouter;