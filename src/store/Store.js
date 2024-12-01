import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Product";

export const store = configureStore({
    reducer: {
        products: productReducer,
    },
});