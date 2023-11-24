import { BaseApi } from './base-api';
import { ProductType } from '../../@types/product';
import { HOST_API } from 'src/config';
import axios from 'src/utils/axios';
// import axios from 'axios';


const productTypeIns = HOST_API+'/api/product-type';

const createProductType = async (formData: FormData) =>
{
    try {
        const response = await axios.post(productTypeIns, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', 
          }
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
}

const productTypeApi = {
    createProductType,
};

Object.freeze(productTypeApi);
export { productTypeApi };
