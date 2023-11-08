import { BaseApi } from './base-api';
import { ProductChar } from "../../@types/product";

const productSpecCharIns = new BaseApi('/api/product/char');
const productSpecCharValuedIns = new BaseApi('/api/product/char/value');

const checkDuplicateCode = (code: string) =>
    productSpecCharValuedIns.post<boolean>(`/${code}`);
const createProductSpecChar  =(productSpecChars: ProductChar)=>
    productSpecCharIns.post<ProductChar>('', productSpecChars)


const productSpecCharApi = {
    checkDuplicateCode,createProductSpecChar
}

Object.freeze(productSpecCharApi);
export { productSpecCharApi };
