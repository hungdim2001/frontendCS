import { BaseApi } from './base-api';
import { CartItem, ProductChar } from '../../@types/product';

const cartIns = new BaseApi('/api/cart');
const addToCart = (cartItem: CartItem) => cartIns.post<CartItem>('', cartItem);
const getCart = () => cartIns.get<CartItem>('');
const cartApi = {
  addToCart,
  getCart
};

Object.freeze(cartApi);
export { cartApi };
