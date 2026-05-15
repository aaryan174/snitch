import { createProduct, getProductData, getSellerData, createVariant } from "../services/product.api.js";
import { setProducts, setSellerProducts, setPagination } from "../state/product.slice.js";
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

    async function handleGetProducts({ search = '', category = 'ALL', page = 1, limit = 8 } = {}) {
        const data = await getProductData({ search, category, page, limit });
        dispatch(setProducts(data.products))
        if (data.pagination) dispatch(setPagination(data.pagination))
        return data;
    }

    async function handleCreateVariant(productId, formData) {
        const data = await createVariant(productId, formData);
        return data;
    }

    return{
        handleCreateProduct,
        handleGetSellerData,
        handleGetProducts,
        handleCreateVariant,
    }
}