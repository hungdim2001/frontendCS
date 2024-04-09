
import { BaseApi } from './base-api';
import { OrderRequest, } from '../../@types/product';

const orderIns = new BaseApi('/api/order');
const createVnPay = (orderRequest: OrderRequest, isVNPAY:boolean) => orderIns.post<string>(`?isVNPAY=${isVNPAY}`, orderRequest);
const checkOrder = () => orderIns.get<string>('/check');
const orderApi = {
    createVnPay,
    checkOrder
};

Object.freeze(orderApi);
export { orderApi };
