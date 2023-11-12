import { createSlice } from '@reduxjs/toolkit';
import { ProductChar, ProductCharState } from 'src/@types/product';
import { dispatch } from '../store';
import axios from '../../utils/axios'
import { productSpecCharApi } from 'src/service/app-apis/product-char';

const initialState: ProductCharState = {
  productChars: [],
};

const slice = createSlice({
  name: 'productChars',
  initialState,
  reducers: {
    // GET PRODUCTS CHARS
    getProductCharsSucess(state, action) {
      state.productChars = action.payload;
    },
  },
});

export default slice.reducer;
export const { getProductCharsSucess } = slice.actions;

export function getProductChars() {
  return async () => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await productSpecCharApi.getProductSpecChars();
      dispatch(slice.actions.getProductCharsSucess(response));
    } catch (error) {
      console.log(error)
    //   dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteProductChars(productCharIds:number[]) {
  return async () => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await productSpecCharApi.deleteProductSpecChars(productCharIds);

      dispatch(slice.actions.getProductCharsSucess(response));
    } catch (error) {
      console.log(error)
    //   dispatch(slice.actions.hasError(error));
    }
  };
}