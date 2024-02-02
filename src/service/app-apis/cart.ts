import { BaseApi } from './base-api';
import { CartItem, ProductChar } from '../../@types/product';

const cartIns = new BaseApi('/api/cart');

const addToCart = (cartItem: CartItem) => cartIns.post<CartItem>('', cartItem);
const cartApi = {
  addToCart,
};

Object.freeze(cartApi);
export { cartApi };
