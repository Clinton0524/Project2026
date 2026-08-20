import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from "./ProductSlice";
const Store = configureStore({
  reducer: {
    products: ProductReducer,
  },
});

export default Store;
