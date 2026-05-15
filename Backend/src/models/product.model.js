import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

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
            }
        }
    ],
    prize: {
      type: priceSchema,
      required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['SHIRTS', 'JACKETS', 'JEANS', 'SNEAKERS', 'ACCESSORIES', 'NEW ARRIVALS', 'TRENDING'],
        default: 'SHIRTS'
    },
    seller:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "UserSnitch",
        required: true
    },
      variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: Map,
                of: String
            },
            price: {
                type: priceSchema,
            }
        },

    ]

}, {timestamps: true});



const  productModel = mongoose.model("product", productSchema);


export default productModel;