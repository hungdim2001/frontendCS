import { createSlice } from '@reduxjs/toolkit';
import { ProductChar, ProductCharState } from 'src/@types/product';
import { dispatch } from '../store';
import axios from '../../utils/axios';
import { productSpecCharApi } from 'src/service/app-apis/product-char';

const initialState: ProductCharState = {
  productChars: [],
  productChar: {} as ProductChar,
};

const slice = createSlice({
  name: 'productChars',
  initialState,
  reducers: {
    getProductCharsSucess(state, action) {
      state.productChars = action.payload;
    },
    getProductCharSucess(state, action) {
      state.productChar = action.payload;
    },
  },
});

export default slice.reducer;
export const { getProductCharsSucess } = slice.actions;

export function getProductChars(id: number | null) {
  return async () => {
    try {
      const response = await productSpecCharApi.getProductSpecChars(id);
      if (id) {
        dispatch(slice.actions.getProductCharSucess(response[0]));
      }else{
        dispatch(slice.actions.getProductCharsSucess(response));
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteProductChars(productCharIds: number[]) {
  return async () => {
    try {
      const response = await productSpecCharApi.deleteProductSpecChars(productCharIds);

      dispatch(slice.actions.getProductCharsSucess(response));
    } catch (error) {
      console.log(error);
    }
  };
}
