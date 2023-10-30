import { BaseApi } from './base-api';
import { UserAccount } from 'src/@types/user';
import { OrNull } from 'src/@types/common';
import { Verify } from 'crypto';
const authApiIns = new BaseApi('/api/auth');
const tokenApiIns  = new BaseApi('/api/token');
export type LoginRequestBody = {
    account: string;
    password: string;
}
export type RegisterRequestBody = {
    email: String;
    phone: String;
    areaCode: String;
    role:String;
    password: String;
    firstName: String;
    lastName: String;
}
type RegisterResponeData = {
    id: string;
    fullName: string;
    role: string;
    avatarUrl: string;
    email: string;
    phone: string;
    userName: string;
    areaCode: string;
    status: Boolean;
};
type LoginResponseData = {

    accessToken: string;
    refreshToken: string;
    refreshExpiresIn: number;
    expiresIn: number;

}
type RefreshTokenBody = {
    rfToken: string;
};
type RefreshTokenResponseData = {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
};
const register = (bodyData: RegisterRequestBody) =>
    authApiIns.post<RegisterResponeData>('/register', bodyData);

const login = (bodyData: LoginRequestBody) =>{
    console.log("url "+authApiIns)
  return  authApiIns.post<LoginResponseData>('/login', bodyData);
}
    


const refreshToken = (bodyData: RefreshTokenBody) =>
tokenApiIns.post<RefreshTokenResponseData>('/refreshToken', bodyData);
const whoAmI = () => authApiIns.get<OrNull<UserAccount>>('/whoami');



// logout
// --------------------
export type LogoutBody = {
    token: string;
};
const logout = (bodyData: LogoutBody) => authApiIns.post('/logout', bodyData);


type SessionParams = {
    accessToken: string;
} | null;
const setSession = (sessionParams: SessionParams) => {
    const apiInstance = authApiIns.getApiInstance();

    if (sessionParams === null) {
        delete apiInstance.defaults.headers.common.Authorization;
        return;
    }


    const { accessToken } = sessionParams;

    apiInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;


};
export type VerifyRequestBody = {
    code: String;
}
const verify = (verifyRequestBody: VerifyRequestBody) =>
    authApiIns.post('/verify', verifyRequestBody)

const reSendCode = () =>
    authApiIns.get('/resendCode')


export type FindEmailRequestBody = {
    email: String;
}
const findEmail = (findEmailRequestBody: FindEmailRequestBody) =>
    authApiIns.post('/findEmail', findEmailRequestBody)
export type ResetPasswordBody = {
    password: string;
}
const resetPassword = (ResetPasswordBody: ResetPasswordBody) =>
    authApiIns.post('/resetPassword', ResetPasswordBody)

const authApi = {
    login, register, setSession, whoAmI, refreshToken, logout, verify, reSendCode, findEmail,resetPassword
}

Object.freeze(authApi);
export { authApi };