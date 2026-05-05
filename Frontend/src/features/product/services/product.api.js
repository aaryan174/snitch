import axios from "axios";

const productApiInstance = await axios.create({
    baseURL: "/api/products",
    withCredentials: true
})


export async function createProduct(formData) {
    const res = await productApiInstance.post("/create", formData);
    return res.data;
}

export async function getSellerData() {
    const res = await productApiInstance.get("/seller");
    return res.data;
}

export async function getProductData() {
    const res = await productApiInstance.get("/");
    return res.data;
}

