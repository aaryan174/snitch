import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        oneProduct:[]
    },
    reducers:{
        setOneProduct: (state, action)=>{
            state.oneProduct = action.payload
        }
    }
});

export const {setOneProduct} = userSlice.actions
export default userSlice.reducer;