import { type } from 'os';
import { BaseApi } from './base-location';

const locationApiIns = new BaseApi('');
export type responseDataLocation = {
   id: number|null;
   name: string|null;
}
const citys = () => locationApiIns.get<Array<responseDataLocation>>('/cities.json');

const districts = (locationId: number) => locationApiIns.get<Array<responseDataLocation>>(`/districts/${locationId}.json`);
const wards = (locationId: number) => locationApiIns.get<Array<responseDataLocation>>(`/wards/${locationId}.json`);

type locationRespone = {
   cityId: number;
   districtId: number;
   wardId: number;
}

const locations = () => locationApiIns.get<locationRespone>('/location.json')
const locationApi = {
   citys, districts, wards, locations
}
Object.freeze(locationApi);
export { locationApi };