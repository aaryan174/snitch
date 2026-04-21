import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: [
        {
            url: {
                type: String,
                required: true
            },
            alt:{
                type: String,
                required: true
            }
        }
    ],
    prize: {
      amount:{
        type: Number,
        required: true
      },
      currency:{
        type: String,
        enum: ["USD", "EUR", "GBP", "JPY", "INR"],
        default: "INR",
        required: true
      }
    },
    description: {
        type: String,
        required: true
    },
    seller:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "UserSnitch",
        required: true
    },

}, {timestamps: true});



const  productModel = mongoose.model("product", productSchema);


export default productModel;