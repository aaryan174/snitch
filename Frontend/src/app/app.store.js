import { configureStore } from "@reduxjs/toolkit";


export consrt store = configureStore({
    reducer: {
        auth: authReducer,
    }
})