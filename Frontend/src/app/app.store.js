import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/state/auth.slice.js"
import productReducer from "../features/product/state/product.slice.js"
import userReducer from "../features/User/state/user.slice.js"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        user: userReducer,
    }
});