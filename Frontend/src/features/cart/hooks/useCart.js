import { setItems, addItem } from "../state/cart.slice.js";
import { addItemApi, getCartApi, removeFromCartApi, updateCartItemQuantityApi } from "../service/cart.api";
import { useDispatch } from "react-redux";


export const useCart = ()=>{
    const dispatch = useDispatch();

    async function handleAddItem({productId, variantId}) {
        try {
            const data = await addItemApi({productId, variantId })
            // dispatch(addItem(data.item))
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function handleGetCart() {
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
    }

    async function handleRemoveItem({productId, variantId}) {
        try {
            const data = await removeFromCartApi({productId, variantId});
            await handleGetCart(); // refresh cart
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function handleUpdateQuantity({productId, variantId, quantity}) {
        try {
            const data = await updateCartItemQuantityApi({productId, variantId, quantity});
            await handleGetCart(); // refresh cart
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return{
        handleAddItem,
        handleGetCart,
        handleRemoveItem,
        handleUpdateQuantity
    }
}