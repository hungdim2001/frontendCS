import { BaseApi } from './base-api';
import { ProductChar } from '../../@types/product';

const productSpecCharIns = new BaseApi('/api/product/char');
const productSpecCharValuedIns = new BaseApi('/api/product/char/value');

const checkDuplicateCode = (value: string, productSpecCharId:number|null, charValueId:number|null  ) => productSpecCharValuedIns.post<boolean>('',{
  productSpecCharId:productSpecCharId,
  value:value,
  charValueId: charValueId

});
const deleteProductSpecCharValue = (ids: number[]) =>
  productSpecCharValuedIns.delete<ProductChar[]>('', { data: ids });

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
  deleteProductSpecCharValue,
};

Object.freeze(productSpecCharApi);
export { productSpecCharApi };
