import productModel from "../models/product.model.js";
import { uploadImage } from "../Services/storage.service.js";


export async function createProductController(req, res) {
   
    try {
         const {title, description, image, prizeAmount, prizeCurrency} = req.body;
        const seller  = req.user;

        const uploadedImages = await Promise.all(req.files.map(async (file)=>{
            const result = await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return result;
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


export const getSellerData = async (req, res) => {
    const seller = req.user;
  try {

    if(!seller){
      return res.status(403).json({
        message: "Unauthorized",
        success: false,
        err: "Unauthorized"
      })
    }

    const products = await productModel.find({seller: seller._id});
    res.status(200).json({
      message: "product fetched successfully",
      success: true,
      products
    })

  } catch (error) {
    console.log("sellerData Error", error.message);
    return res.status(500).json({
      message:"Server error",
      success: false,
      err: "server error"
    })
  }
}

export const getProductUserData = async (req, res) => {
  const products = await productModel.find()

  return res.status(200).json({
    message:"Products fetched successfully",
    success: true,
    products
  })
}