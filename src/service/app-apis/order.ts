
import { BaseApi } from './base-api';
import { OrderRequest, } from '../../@types/product';

const orderIns = new BaseApi('/api/order');
const createVnPay = (orderRequest: OrderRequest) => orderIns.post<string>('/vnpay', orderRequest);
const checkOrder = () => orderIns.get<string>('/check');
const orderApi = {
    createVnPay,
    checkOrder
};

Object.freeze(orderApi);
export { orderApi };
