import express from "express";
import { sellerCheckMiddleware } from "../middlewares/seller.middleware.js";
import multer from 'multer'
import { createProductController } from "../controllers/product.controller.js";



const productRouter = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024 //5mb
    }
})


productRouter.post("/create", sellerCheckMiddleware, upload.array("image", 7), createProductController);




export default productRouter;