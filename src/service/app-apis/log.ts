import { CurrentLocation } from 'src/contexts/LocationContext';
import { BaseApi } from './base-api';

const logApiIns = new BaseApi('/api/log');
export type ActionAudit = {
  userId: number;
  browser: string;
  ipClient: string;
  actionTime: Date;
  action: string;
  productId: number;
  deviceType: string;
  keyWord: string;
  lat: string;
  lon: string;
  road: string;
  quarter: string;
  suburb: string;
  city: string;
  postcode: string;
  country: string;
  country_code: string;
};

const createLog = (log: ActionAudit) => {
  return logApiIns.post('', log);
};

const logApi = {
  createLog,
};
Object.freeze(logApi);
export { logApi };
