import { DeliveryService } from 'src/redux/slices/deliveryService';
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
};
export type EstimateDeliveryTimeRequest = {
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code: string;
  service_id: number;
};
export type EstimateResponse = {
  leadtime: number;
  order_date: number;
};
export type Item = {
  name: string;
  quantity: number;
  height: number;
  length: number;
  weight: number;
  width: number;
};
export const defaultItem: Item = {
 name: '' ,
  quantity: 1, 
  height:20, 
  length: 40,
  weight: 3000,
  width: 20,
}
export type CaculateFeeRequest = {
  service_id: number;
  from_district_id: number;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
  insurance_value: number;
  coupon: string;
  items: Item[];
};
export const defaultCaculateFeeRequest: CaculateFeeRequest = {
  service_id: 0,
  from_district_id: 3440,
  to_district_id: 0,
  to_ward_code: '',
  height: 20,
  length: 40,
  weight: 3000,
  width: 20,
  insurance_value: 0,
  coupon: '',
  items: [],
};
export type CaculateFeeResponse ={
  total:number;
 serivce_fee:number;
 insurance_fee: number;
 pick_station_fee:number;
 coupon_value:number;
 r2s_fee:number;
 document_return:number;
 double_check:number;
 cod_fee:number;
 pick_remote_areas_fee:number;
 deliver_remote_areas_fee:number;

}

const caculateFee = (caculateFeeRequest:CaculateFeeRequest) =>
  ghnIns.post<CaculateFeeResponse>('v2/shipping-order/fee',caculateFeeRequest);
const getEstimateTime = (estimateRequest: EstimateDeliveryTimeRequest) =>
  ghnIns.post<EstimateResponse>('v2/shipping-order/leadtime', estimateRequest);
const getService = (serviceRequest: ServiceRequest) =>
  ghnIns.post<DeliveryService[]>('v2/shipping-order/available-services', serviceRequest);
const getWard = (districtId: number) =>
  ghnIns.get<ghnAddress[]>('master-data/ward', {
    params: {
      district_id: districtId,
    },
  });
const ghnApi = { getProvince, getEstimateTime, getDistrict, getWard, getService, caculateFee };
Object.freeze(ghnApi);
export { ghnApi };
