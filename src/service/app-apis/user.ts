
import { BaseApi } from './base-api';
import { Address, BillingAddress, ProductChar } from '../../@types/product';
import { UserAccount } from 'src/@types/user';
import { AuthUser } from 'src/@types/auth';

const userIns= new BaseApi('/api/user');

const update= (user:any ) =>
  userIns.put('', user);
const userApi = {
 update 
};

Object.freeze(userApi);
export {userApi};

