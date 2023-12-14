import { BaseApi } from './base-api';
import { Product } from '../../@types/product';
import { BaseFormDataApi } from './base-form-data-api';
// import axios from 'axios';
const productIns = new BaseApi('/api/product');
const productFormIns = new BaseFormDataApi('/api/product');

const getProducts = (id:number|null) => {
  const path = id ? `/${id}` : '';

  return productIns.get<Product[]>(`/${path}`);
};

const deleteProducts = (ids:number[]) => {
  return productIns.delete<Product[]>('',{ data: ids });
};


const createProduct = (formData: FormData) => {
  return productFormIns.post<Product>('',formData);
};

const productApi = {
    deleteProducts,
  createProduct,
  getProducts,
};

Object.freeze(productApi);
export { productApi };
