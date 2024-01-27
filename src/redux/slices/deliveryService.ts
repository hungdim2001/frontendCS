
import { createSlice } from '@reduxjs/toolkit';

const initialState: DeliveryState = {
 deliveryServices: [],
};
export type DeliveryState = {
  deliveryServices: DeliveryService[]
};

export type DeliveryService = {
  service_id: number;
  short_name: number;
  service_type_id: number;
}
const slice = createSlice({
  name: 'deliveryService',
  initialState,
  reducers: {
    getDelverySucess(state, action) {
      state.deliveryServices= action.payload;
    },
  },
});

export default slice.reducer;
export const {getDelverySucess,} = slice.actions;