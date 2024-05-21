import { BaseApi } from './base-api';
import { ProductType, Rating } from '../../@types/product';
import { BaseFormDataApi } from './base-form-data-api';
// import axios from 'axios';
const ratingIns = new BaseApi('/api/rating');

const addComment = (rating: Rating) => {
  return ratingIns.post<ProductType[]>('', rating);
};
const ratingApi = {
  addComment,
};

Object.freeze(ratingApi);
export { ratingApi };
