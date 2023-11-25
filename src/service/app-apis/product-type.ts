import { BaseApi } from './base-api';
import { ProductType } from '../../@types/product';
import { HOST_API } from 'src/config';
import axios from 'src/utils/axios';
// import axios from 'axios';
const productTypeIns = new BaseApi('/api/product-type');
const productTypeFormIns = HOST_API+'/api/product-type';

const getProductTypes = () => {
  return productTypeIns.get<ProductType[]>('');
};

const createProductType = async (formData: FormData) =>
{
    try {
        const response = await axios.post(productTypeFormIns, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          }
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
}

const productTypeApi = {
    createProductType,getProductTypes
};

Object.freeze(productTypeApi);
export { productTypeApi };
