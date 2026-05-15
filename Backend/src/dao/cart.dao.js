import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";


export const  getCartDetail = async (userId) => {
     let cart = await cartModel.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    { $unwind: { path: '$items' } },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'items.product'
      }
    },
    { $unwind: { path: '$items.product' } },
    {
      $addFields: {
        'items.product.variants': {
          $let: {
            vars: {
              matchedVariant: {
                $filter: {
                  input: { $ifNull: ['$items.product.variants', []] },
                  as: 'v',
                  cond: { $eq: ['$$v._id', '$items.variant'] }
                }
              }
            },
            in: { $arrayElemAt: ['$$matchedVariant', 0] }
          }
        }
      }
    },
    {
      $addFields: {
        itemPrice: {
          price: {
            $multiply: [
              '$items.quantity',
              { $ifNull: ['$items.product.variants.price.amount', '$items.product.prize.amount'] }
            ]
          },
          currency: { $ifNull: ['$items.product.variants.price.currency', '$items.product.prize.currency'] }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        totalPrice: { $sum: '$itemPrice.price' },
        currency: {
          $first: '$itemPrice.currency'
        },
        items: { $push: '$items' }
      }
    }
  ]);

  return cart
}