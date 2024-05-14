import { createSlice } from '@reduxjs/toolkit';
import { MenuState } from 'src/@types/product';
import { dispatch } from '../store';
export const UserMenu = [
  { title: 'Personal Data', icon: '/icons/user-edit.svg' },
  { title: 'Payment & Instalments', icon: '/icons/dollar-circle.svg' },
  { title: 'Order', icon: '/icons/ic_bag.svg' },
  { title: 'Security & access', icon: '/icons/security-safe.svg' },
];
const initialState: MenuState = {
  optionSelected: UserMenu[0],
};

const slice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    addOption(state, action) {
      const selected = action.payload;
      state.optionSelected = selected;
    },
  },
});

export default slice.reducer;
export const {} = slice.actions;

export function setOptionMenuSelected(option: Object) {
  return async () => {
    try {
      dispatch(slice.actions.addOption(option));
    } catch (error) {
      console.log(error);
    }
  };
}
