import { BaseApi } from './base-api';
import { ProductType } from '../../@types/product';
import { HOST_API } from 'src/config';
import axios from 'src/utils/axios';
import { BaseFormDataApi } from './base-form-data-api';
// import axios from 'axios';
const productTypeIns = new BaseApi('/api/product-type');
const productTypeFormIns = new BaseFormDataApi('/api/product-type');

const getProductTypes = () => {
  return productTypeIns.get<ProductType[]>('');
};

const deleteproductTypes = (ids:number[]) => {
  return productTypeIns.delete<ProductType[]>('',{ data: ids });
};


const createProductType = (formData: FormData) => {
  return productTypeFormIns.post<ProductType>('',formData);
};

const productTypeApi = {
  deleteproductTypes,
  createProductType,
  getProductTypes,
};

Object.freeze(productTypeApi);
export { productTypeApi };
