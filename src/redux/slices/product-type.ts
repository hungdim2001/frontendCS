import { createSlice } from '@reduxjs/toolkit';
import { ProductChar, ProductTypeState } from 'src/@types/product';
import { dispatch } from '../store';
import axios from '../../utils/axios';
import { productSpecCharApi } from 'src/service/app-apis/product-char';

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

export function getproductTypes(id: number | null) {
  return async () => {
    try {
      const response = await productSpecCharApi.getProductSpecChars(id);
      if (id) {
        // dispatch(slice.actions.getproductTypesucess(response[0]));
      }else{
        dispatch(slice.actions.getproductTypesSucess(response));
        // dispatch(slice.actions.getproductTypesucess({} as ProductChar));

      }
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
