
import { BaseApi } from './base-api';
import { Address, BillingAddress, ProductChar } from '../../@types/product';
import useId from '@mui/material/utils/useId';

const addressIns = new BaseApi('/api/address');

const createOrUpdate= (billingAddress:BillingAddress) =>
  addressIns.post<Address[]>('', billingAddress);
const getByUserId = (userId: number) => {
  return addressIns.get<Address[]>(`/${userId}`);
};
const addressApi = {
  createOrUpdate,
  getByUserId
};

Object.freeze(addressApi);
export { addressApi};
