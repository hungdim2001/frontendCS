import { BaseGHNApi } from './base-ghn';

const ghnIns = new BaseGHNApi('');
export type ghnAddress = {
  ProvinceID: number;
  ProvinceName: string;
  DistrictID: number;
  WardName: string;
  WardCode: string;
  DistrictName: string;
  NameExtension?: string;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: 1 | 2;
};
const getProvince = () => ghnIns.get<ghnAddress[]>('master-data/province');

const getDistrict = (provinceId: number) =>
  ghnIns.get<ghnAddress[]>('master-data/district', {
    params: {
      province_id: provinceId,
    },
  });

const getWard = (districtId: number) =>
  ghnIns.get<ghnAddress[]>('master-data/ward', {
    params: {
      district_id: districtId,
    },
  });
// const createOrUpdate = (billingAddress: BillingAddress) =>
//   addressIns.post<Address[]>('', billingAddress);
// const getByUserId = (userId: number) => {
//   return addressIns.get<Address[]>(`/${userId}`);
// };
// const addressApi = {
//   createOrUpdate,
//   getByUserId,
//   deleteAddress,
// };

const ghnApi = { getProvince, getDistrict, getWard };
Object.freeze(ghnApi);
export { ghnApi };
