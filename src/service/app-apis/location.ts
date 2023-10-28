import { type } from 'os';
import { BaseApi } from './base-api';

const locationApiIns = new BaseApi('/api/area');
export type areaResponse = {
   id: number|null;
   name: string|null;
   createDatetime:Date|null ;
   updateDatetime: Date|null ;
   createUser: string|null;
    updateUser: string|null;
    status: Boolean|null,
    areaCode: string|null;
    province: string|null;
    district: string|null;
    precinct: string|null;
    streetBlock: string|null;
    parentCode: string|null;
    fullName: string|null;
}
const area = (parentCode:string|null) => {
  const path = parentCode ? `/${parentCode}`:''; 
  return locationApiIns.get<Array<areaResponse>>(`/${path}`);
};

// const districts = (locationId: number) => locationApiIns.get<Array<areaResponse>>(`/districts/${locationId}.json`);
// const wards = (locationId: number) => locationApiIns.get<Array<areaResponse>>(`/wards/${locationId}.json`);

// type locationRespone = {
//    cityId: number;
//    districtId: number;
//    wardId: number;
// }

// const locations = () => locationApiIns.get<locationRespone>('/location.json')
const locationApi = {
   area
}
Object.freeze(locationApi);
export { locationApi };