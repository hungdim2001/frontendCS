import { createSlice } from '@reduxjs/toolkit';
import { AddressState } from 'src/@types/product';
import { addressApi } from 'src/service/app-apis/address';
import { dispatch } from '../store';

const initialState: AddressState = {
 adresss: [],
};

const slice = createSlice({
  name: 'addresss',
  initialState,
  reducers: {
    getAddressSucess(state, action) {
      state.adresss = action.payload;
    },
    // deleteAddress(state, action) {
    //   state.adresss = action.payload;
    // },
  },
});

export default slice.reducer;
export const {getAddressSucess,} = slice.actions;

export function getAddress(userId: number) {
  return async () => {
    try {
      const response = await addressApi.getByUserId(userId);
        dispatch(slice.actions.getAddressSucess(response));
    } catch (error) {
      console.log(error);
    }
  };
}

// export function deleteAddress(ids: number[]) {
//   return async () => {
//     try {
//       await productTypeApi.deleteproductTypes(ids);
//       dispatch(slice.actions.getAddressSucess(ids))
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
// }