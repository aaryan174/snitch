import express from "express"
import { getOneProductDetail } from "../controllers/product.controller.js";



const UserRouter = express.Router();


UserRouter.get("/Product/:productId", getOneProductDetail)

export default UserRouter;
