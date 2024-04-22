
import { BaseApi } from './base-api';

const logApiIns = new BaseApi('/api/log');
export type ActionAudit ={
    userId?: number;
    browser?: string;
    ipClient?: string;
    actionTime?: Date;
    action?: string;
    productId?: number;
    deviceType?: string;
    location?: string;
    search?: string;
}

const createLog=(log: ActionAudit)=>{
    return logApiIns.post('', log);
}

const logApi = {
  createLog 
}
Object.freeze(logApi);
export { logApi };