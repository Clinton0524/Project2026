import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk("get/products", async () => {
  const response = await fetch(
    `https://newback-aold.onrender.com/api/products`
  );
  if (!response.ok) {
    throw new Error("error while fetching products");
  } else {
    return response.json();
  }
});

export const fetchExclusiveProducts = createAsyncThunk("get/exclusiveproducts", async () => {
  const response = await fetch(
    `https://newback-aold.onrender.com/api/products/exclusive`
  );
  if (!response.ok) {
    throw new Error("error while fetching products");
  } else {
    return response.json();
  }
});

const ProductSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    exclusiveProducts:[],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
       .addCase(fetchExclusiveProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExclusiveProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.exclusiveProducts = action.payload.products;
      })
      .addCase(fetchExclusiveProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ProductSlice.reducer;
