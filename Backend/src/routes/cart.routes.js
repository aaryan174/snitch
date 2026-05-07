import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { addToCartController, getCart } from "../controllers/cart.controller";
import { validateAddToCart } from "../validators/cart.validator";


const cartRouter = express.Router();

cartRouter.post("/add/:productId/:varientId", protect, validateAddToCart, addToCartController);

cartRouter.get("/", protect, getCart)


export default cartRouter;