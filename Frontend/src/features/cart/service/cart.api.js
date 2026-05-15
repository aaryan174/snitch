import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
});


export const addItemApi = async ({productId, variantId})=> {
    // If variantId is undefined, we pass a dummy string or handle it on the backend, 
    // but since the route expects /:productId/:variantId, we must provide something, e.g., 'none'
    const vId = variantId || 'none';
    const res = await cartApiInstance.post(`/add/${productId}/${vId}`,{
        quantity: 1
    })
    return res.data;
}

export const getCartApi = async () => {
    const res = await cartApiInstance.get("/");
    return res.data;
}

export const removeFromCartApi = async ({productId, variantId}) => {
    const vId = variantId || 'none';
    const res = await cartApiInstance.delete(`/remove/${productId}/${vId}`);
    return res.data;
}

export const updateCartItemQuantityApi = async ({productId, variantId, quantity}) => {
    const vId = variantId || 'none';
    const res = await cartApiInstance.put(`/update/${productId}/${vId}`, { quantity });
    return res.data;
}

export const createCartOrder = async () => {
    const res = await cartApiInstance.post("/payment/create/order");
    return res.data;
}

export const verifyCartOrder = async ({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
    const res = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return res.data;
}

export const getOrdersApi = async () => {
    const res = await cartApiInstance.get("/orders");
    return res.data;
}