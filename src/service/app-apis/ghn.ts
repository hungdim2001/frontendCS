import { DeliveryService, } from 'src/redux/slices/deliveryService';
import { BaseGHNApi } from './base-ghn';

const ghnIns = new BaseGHNApi('');
export type ghnAddress = {
  ProvinceID: number;
  ProvinceName: string;
  DistrictID: number;
  WardName: string;
  WardCode: number;
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

export type ServiceRequest = {
  shop_id: number;
  from_district: number;
  to_district: number;
}

const getService = (serviceRequest: ServiceRequest) =>
  ghnIns.post<DeliveryService[]>('v2/shipping-order/available-services', serviceRequest)
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

const ghnApi = { getProvince, getDistrict, getWard, getService };
Object.freeze(ghnApi);
export { ghnApi };
