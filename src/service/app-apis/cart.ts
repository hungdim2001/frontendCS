import { BaseApi } from './base-api';
import { CartItem, ProductChar } from '../../@types/product';

const cartIns = new BaseApi('/api/cart');

const addToCart = (cartItems: CartItem[]) => cartIns.post<CartItem>('', cartItems);
const cartApi = {
  addToCart,
};

Object.freeze(cartApi);
export { cartApi };
