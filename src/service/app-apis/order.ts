
import { BaseApi } from './base-api';
import { CartItem, OrderRequest, } from '../../@types/product';

const cartIns = new BaseApi('/api/order');
const createVnPay= (orderRequest: OrderRequest) => cartIns.post<string>('/vnpay',orderRequest);
const cartApi = {
  createVnPay 
};

Object.freeze(cartApi);
export { cartApi };
