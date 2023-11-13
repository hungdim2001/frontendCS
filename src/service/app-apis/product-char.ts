import { BaseApi } from './base-api';
import { ProductChar } from '../../@types/product';

const productSpecCharIns = new BaseApi('/api/product/char');
const productSpecCharValuedIns = new BaseApi('/api/product/char/value');

const checkDuplicateCode = (code: string) => productSpecCharValuedIns.post<boolean>(`/${code}`);

const createProductSpecChar = (productSpecChars: ProductChar) =>
  productSpecCharIns.post<ProductChar>('', productSpecChars);

const getProductSpecChars = (id: number | null) => {
  const path = id ? `/${id}` : '';

  return productSpecCharIns.get<ProductChar[]>(`/${path}`);
};

const deleteProductSpecChars = (productSpecCharIds: number[]) =>
  productSpecCharIns.delete<ProductChar[]>('', { data: productSpecCharIds });

const productSpecCharApi = {
  checkDuplicateCode,
  createProductSpecChar,
  getProductSpecChars,
  deleteProductSpecChars,
};

Object.freeze(productSpecCharApi);
export { productSpecCharApi };
