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
    deleteProductType(state, action) {
      console.log(action.payload)
      const updateProductType = state.productTypes.filter(item => !action.payload.includes(item.id));
      console.log(updateProductType);
      state.productTypes = updateProductType;
    },
  },
});

export default slice.reducer;
export const { getproductTypesSucess,deleteProductType } = slice.actions;

export function getProductTypes() {
  return async () => {
    try {
      const response = await productTypeApi.getProductTypes();
        dispatch(slice.actions.getproductTypesSucess(response));
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteProductTypes(ids: number[]) {
  return async () => {
    try {
      await productTypeApi.deleteproductTypes(ids);
      dispatch(slice.actions.deleteProductType(ids))
    } catch (error) {
      console.log(error);
    }
  };
  
}