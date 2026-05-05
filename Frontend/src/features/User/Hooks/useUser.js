import { useDispatch } from "react-redux"
import { getOneProductData } from "../service/user.api.js";
import { setOneProduct } from "../state/user.slice.js";

export const useUser = () => {

    const dispatch = useDispatch();

    async function handleOneProductData(productId) {
        const data = await getOneProductData(productId);
        dispatch(setOneProduct(data.Product))
        return data.Product;
    }


    return {
        handleOneProductData,
    }
}