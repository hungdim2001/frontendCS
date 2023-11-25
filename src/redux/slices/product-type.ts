import { createSlice } from '@reduxjs/toolkit';
import { ProductChar, ProductTypeState } from 'src/@types/product';
import { dispatch } from '../store';
import axios from '../../utils/axios';
import { productSpecCharApi } from 'src/service/app-apis/product-char';
import { productTypeApi } from 'src/service/app-apis/product-type';

const initialState: ProductTypeState = {
  productTypes: [],
};

const slice = createSlice({
  name: 'productTypes',
  initialState,
  reducers: {
    getproductTypesSucess(state, action) {
      state.productTypes = action.payload;
    },
    // getproductTypesucess(state, action) {
    //   state.productChar = action.payload;
    // },
  },
});

export default slice.reducer;
export const { getproductTypesSucess } = slice.actions;

export function getproductTypes() {
  return async () => {
    try {
      const response = await productTypeApi.getProductTypes();
      console.log(response)
        dispatch(slice.actions.getproductTypesSucess(response));
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteproductTypes(productCharIds: number[]) {
  return async () => {
    try {
      const response = await productSpecCharApi.deleteProductSpecChars(productCharIds);
      dispatch(slice.actions.getproductTypesSucess(response));
    } catch (error) {
      console.log(error);
    }
  };
  
}
export function deleteProductCharValue(productCharValueIds: number[]) {
  return async () => {
    try {
      const response = await productSpecCharApi.deleteProductSpecCharValue(productCharValueIds);
      dispatch(slice.actions.getproductTypesSucess(response));
    } catch (error) {
      console.log(error);
    }
  };
};
