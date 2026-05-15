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

export async function getProductData({ search = '', category = 'ALL', page = 1, limit = 8 } = {}) {
    const params = { page, limit };
    if (search)              params.search   = search;
    if (category !== 'ALL') params.category = category;
    const res = await productApiInstance.get("/", { params });
    return res.data;
}

export async function createVariant(productId, formData) {
    const res = await productApiInstance.post(`/${productId}/variants`, formData);
    return res.data;
}

export async function updateProduct(productId, formData) {
    const res = await productApiInstance.put(`/${productId}`, formData);
    return res.data;
}

export async function updateVariant(productId, variantId, formData) {
    const res = await productApiInstance.put(`/${productId}/variants/${variantId}`, formData);
    return res.data;
}
