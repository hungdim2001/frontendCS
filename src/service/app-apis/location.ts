import { BaseApi } from './base-api';

const locationApiIns = new BaseApi('/api/area');
export type areaResponse = {
   id: number|undefined;
   name: string|undefined;
   createDatetime:Date|undefined ;
   updateDatetime: Date|undefined ;
   createUser: string|undefined;
    updateUser: string|undefined;
    status: Boolean|undefined,
    areaCode: string|undefined;
    province: string|undefined;
    district: string|undefined;
    precinct: string|undefined;
    streetBlock: string|undefined;
    parentCode: string|undefined;
    fullName: string|undefined;
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