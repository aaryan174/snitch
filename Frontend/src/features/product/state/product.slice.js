import {createSlice} from "@reduxjs/toolkit"

const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        products: [],
        pagination: {
            currentPage:   1,
            totalPages:    1,
            totalProducts: 0,
            limit:         8,
        }
    },
    reducers:{
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setPagination: (state, action) => {
            state.pagination = action.payload
        },
    }
});

export const {setSellerProducts, setProducts, setPagination} = productSlice.actions;
export default productSlice.reducer;