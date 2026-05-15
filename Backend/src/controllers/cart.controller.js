import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { createOrder } from "../Services/payment.service.js";
import { getCartDetail } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification} from "razorpay/dist/utils/razorpay-utils.js";

export const addToCartController = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity = 1 } = req.body;

        const isVariantProvided = variantId && variantId !== 'none' && variantId !== 'undefined';

        let query = { _id: productId };
        if (isVariantProvided) {
            query["variants._id"] = variantId;
        }

        const product = await productModel.findOne(query);

        if (!product) {
            return res.status(404).json({
                message: "Product or variant not found",
                success: false
            });
        }

        const variant = isVariantProvided ? product.variants.id(variantId) : null;
        const stock = variant ? variant.stock : Infinity;

        const cart = (await cartModel.findOne({ user: req.user._id })) ||
            (await cartModel.create({ user: req.user._id }));

        const isProductAlreadyInCart = cart.items.some(item => 
            item.product.toString() === productId && 
            (isVariantProvided ? item.variant?.toString() === variantId : !item.variant)
        );

        if (isProductAlreadyInCart) {
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId && 
                (isVariantProvided ? item.variant?.toString() === variantId : !item.variant)
            );
            const quantityInCart = existingItem.quantity;
            
            if (quantityInCart + quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                    success: false
                });
            }

            existingItem.quantity += quantity;
            await cart.save();

            return res.status(200).json({
                message: "Cart updated successfully",
                success: true
            });
        }

        if (quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock`,
                success: false
            });
        }

        // Make sure we get the correct price
        const price = variant && variant.price ? variant.price : product.prize;

        cart.items.push({
            product: productId,
            variant: isVariantProvided ? variantId : null,
            quantity,
            price: price
        });

        await cart.save();

        return res.status(200).json({
            message: "Product added to cart successfully",
            success: true
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}




export const getCart = async (req, res) => {
    try {
        const user = req.user;
        let cart = await getCartDetail(user._id)

        if (!cart || cart.length === 0) {
            const newCart = await cartModel.create({ user: user._id });
            return res.status(200).json({
                message: "Cart fetched successfully",
                success: true,
                cart: newCart
            });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart: cart[0]
        });
    } catch (error) {
        console.error("Get Cart Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export const removeFromCartController = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const isVariantProvided = variantId && variantId !== 'none' && variantId !== 'undefined';

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => {
            const isProductMatch = item.product.toString() === productId;
            const isVariantMatch = isVariantProvided 
                ? item.variant?.toString() === variantId 
                : !item.variant;
            
            return !(isProductMatch && isVariantMatch);
        });

        await cart.save();
        return res.status(200).json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error("Remove from cart error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateCartItemQuantityController = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity } = req.body; // new quantity

        const isVariantProvided = variantId && variantId !== 'none' && variantId !== 'undefined';

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const existingItem = cart.items.find(item => 
            item.product.toString() === productId && 
            (isVariantProvided ? item.variant?.toString() === variantId : !item.variant)
        );

        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items = cart.items.filter(item => item !== existingItem);
        } else {
            // Verify stock
            let query = { _id: productId };
            if (isVariantProvided) {
                query["variants._id"] = variantId;
            }
            const product = await productModel.findOne(query);
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            const variant = isVariantProvided ? product.variants.id(variantId) : null;
            const stock = variant ? variant.stock : Infinity;

            if (quantity > stock) {
                return res.status(400).json({ success: false, message: `Only ${stock} items left in stock` });
            }

            existingItem.quantity = quantity;
        }

        await cart.save();
        return res.status(200).json({ success: true, message: "Cart updated successfully" });
    } catch (error) {
        console.error("Update cart quantity error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const createOrderController = async (req, res) => {
    try {
        const cartArr = await getCartDetail(req.user._id);

        if (!cartArr || cartArr.length === 0) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false
            });
        }

        const cart = cartArr[0]; // getCartDetail returns an array

        if (!cart.totalPrice || cart.totalPrice === 0) {
            return res.status(400).json({
                message: "Cart has no items to checkout",
                success: false
            });
        }

        const currency = cart.currency || "INR";
        const order = await createOrder({ amount: cart.totalPrice, currency });

        await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id,
            },
            price: {
                amount: cart.totalPrice,
                currency
            },
            orderItems: cart.items.map(item => {
                const variant = item.product.variants; // aggregation puts matched variant here (object, not array)
                const priceAmount = variant?.price?.amount ?? item.product.prize?.amount ?? 0;
                const priceCurrency = variant?.price?.currency ?? item.product.prize?.currency ?? "INR";

                // product.image (singular) is the correct field name in the schema
                // prefer variant images if present, fall back to product-level images
                const images = (variant?.images?.length > 0 ? variant.images : item.product.image) ?? [];

                return {
                    title: item.product.title,
                    productId: item.product._id,
                    variantId: item.variant?._id ?? null,
                    quantity: item.quantity,
                    images,
                    description: item.product.description,
                    price: {
                        amount: priceAmount,
                        currency: priceCurrency
                    }
                };
            })
        });

        return res.status(201).json({
            message: "Order created successfully",
            success: true,
            order
        });
    } catch (error) {
        console.error("Create order error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

export const verifyOrderController = async (req, res) => {
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const payment = await paymentModel.findOne({
            "razorpay.orderId": razorpay_order_id,
            status: "pending",
        });

        if (!payment) {
            return res.status(400).json({
                message: "Payment not found",
                success: false
            });
        }

        const isPaymentValid = validatePaymentVerification({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
        }, razorpay_signature, process.env.RAZORPAY_SECRET_KEY);

        if (!isPaymentValid) {
            payment.status = "failed";
            await payment.save();

            return res.status(400).json({
                message: "Payment verification failed",
                success: false
            });
        }

        payment.status = "paid";
        payment.razorpay.paymentId = razorpay_payment_id;
        payment.razorpay.signature = razorpay_signature;
        await payment.save();

        // ✅ Clear the cart after successful payment
        const cart = await cartModel.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            message: "Payment verified successfully",
            success: true
        });
    } catch (error) {
        console.error("Verify order error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

export const getOrdersController = async (req, res) => {
    try {
        const orders = await paymentModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        // Enrich orderItems that have no saved images (fixes old orders placed before the bug fix)
        const enriched = await Promise.all(
            orders.map(async (order) => {
                const enrichedItems = await Promise.all(
                    (order.orderItems ?? []).map(async (item) => {
                        // Already has images saved — nothing to do
                        if (item.images && item.images.length > 0) return item;

                        // Fetch images live from the product collection
                        const product = await productModel
                            .findById(item.productId)
                            .select("image variants")
                            .lean();

                        if (!product) return item;

                        let images = product.image ?? [];

                        // Prefer variant images if a variantId is stored
                        if (item.variantId && product.variants?.length > 0) {
                            const variant = product.variants.find(
                                (v) => v._id.toString() === item.variantId?.toString()
                            );
                            if (variant?.images?.length > 0) images = variant.images;
                        }

                        return { ...item, images };
                    })
                );

                return { ...order, orderItems: enrichedItems };
            })
        );

        return res.status(200).json({
            message: "Orders fetched successfully",
            success: true,
            orders: enriched
        });
    } catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}
