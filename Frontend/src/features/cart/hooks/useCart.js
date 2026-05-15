import { setItems, addItem } from "../state/cart.slice.js";
import { addItemApi, getCartApi, removeFromCartApi, updateCartItemQuantityApi, createCartOrder, verifyCartOrder } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const useCart = ()=>{
    const dispatch = useDispatch();

    const handleAddItem = useCallback(async ({productId, variantId}) => {
        try {
            const data = await addItemApi({productId, variantId })
            // dispatch(addItem(data.item))
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, []);

    const handleGetCart = useCallback(async () => {
        try {
            const data = await getCartApi();
            if (data && data.cart) {
                dispatch(setItems(data.cart.items));
            }
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, [dispatch]);

    const handleRemoveItem = useCallback(async ({productId, variantId}) => {
        try {
            const data = await removeFromCartApi({productId, variantId});
            await handleGetCart(); // refresh cart
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [handleGetCart]);

    const handleUpdateQuantity = useCallback(async ({productId, variantId, quantity}) => {
        try {
            const data = await updateCartItemQuantityApi({productId, variantId, quantity});
            await handleGetCart(); // refresh cart
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [handleGetCart]);

    const handleCreateCartOrder = async () => {
        const data = await createCartOrder()
        return data.order;
    }

    const handleVerifyCartOrder = async ({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
        const data = await verifyCartOrder({razorpay_order_id, razorpay_payment_id, razorpay_signature})
        return data.success;
    }
    return{
        handleAddItem,
        handleGetCart,
        handleRemoveItem,
        handleUpdateQuantity,
        handleCreateCartOrder,
        handleVerifyCartOrder
    }
}