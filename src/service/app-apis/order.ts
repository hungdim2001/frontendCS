
import { BaseApi } from './base-api';
import { OrderRequest, } from '../../@types/product';

const orderIns = new BaseApi('/api/order');
const createVnPay = (orderRequest: OrderRequest) => orderIns.post<string>('/vnpay', orderRequest);
const orderApi = {
    createVnPay
};

Object.freeze(orderApi);
export { orderApi };
