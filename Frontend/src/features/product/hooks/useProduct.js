import { createProduct, getSellerData } from "../services/product.api.js";
import { setSellerProducts } from "../state/product.slice.js";
import { useDispatch } from "react-redux";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData);
        return data.product
    }

    async function handleGetSellerData() {
        const data = await getSellerData();
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    return{
        handleCreateProduct,
        handleGetSellerData
    }
}