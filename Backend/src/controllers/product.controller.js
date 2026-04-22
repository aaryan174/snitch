import productModel from "../models/product.model.js";
import { uploadImage } from "../Services/storage.service.js";


export async function createProductController(req, res) {
   
    try {
         const {title, description, image, prizeAmount, prizeCurrency} = req.body;
        const seller  = req.user;

        const uploadedImages = await Promise.all(req.files.map(async (file)=>{
            return await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }));

        const product = await productModel.create({
            title,
            description,
            prize:{
                amount: prizeAmount,
                currency: prizeCurrency || "INR"
            },
            image: uploadedImages.map(img => ({ url: img.url })),
            seller: seller._id
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