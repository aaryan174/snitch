import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

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

        let cart = await cartModel.findOne({ user: user._id })
            .populate('items.product');

        if (!cart) {
            cart = await cartModel.create({ user: user._id });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart
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