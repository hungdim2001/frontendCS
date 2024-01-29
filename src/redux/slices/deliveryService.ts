
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
  leadtime:number;
}
const slice = createSlice({
  name: 'deliveryService',
  initialState,
  reducers: {
    createDeliveryService(state, action) {
      state.deliveryServices= action.payload;
    },
  },
});

export default slice.reducer;
export const {} = slice.actions;