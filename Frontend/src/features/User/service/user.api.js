import axios from "axios";

const userApiInstance = await axios.create({
    baseURL: "/api/user",
    withCredentials: true
})

export async function getOneProductData(productId) {
    const res = await userApiInstance.get(`/Product/${productId}`)
    return res.data;
}