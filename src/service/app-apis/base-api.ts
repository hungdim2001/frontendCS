import axios, { AxiosInstance } from 'axios';
// config
import { HOST_API } from 'src/config';
//
import qs from 'qs';
// utils
import { concatPath } from 'src/utils/url';
import { getRefreshToken, persistRefreshToken } from 'src/utils/refreshTokenStorage';

// ----------------------------------------------------------------------

const hostApiIns = axios.create({
  baseURL: HOST_API,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: function (params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  },
});

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}

export type ErrorResponse<T = any> = {
  status?: number;
  message: string;
  data?: Record<string, T>;
  error?: string;
};
export class AppApiError extends Error {
  public info: ErrorResponse;

  constructor(errorInfo: ErrorResponse) {
    const normalizedErrorInfo = {
      ...errorInfo,
      message: errorInfo.message
        ? errorInfo.message
        : typeof errorInfo.error === 'string'
        ? errorInfo.error
        : '',
    };
    super();
    this.name = 'AppApiError';
    this.info = normalizedErrorInfo;
  }

  getInfo() {
    return this.info;
  }
}

hostApiIns.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    const errorData = error.response && error.response.data;
    if (!errorData) {
      return Promise.reject(
        new AppApiError({
          message: 'messages.errors.common',
        }).getInfo()
      );
    }
    if (errorData.response) {
      // Access Token was expired
      if (errorData.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const oldRfToken = await getRefreshToken()!;
          const { accessToken, refreshToken, expiresIn, refreshExpiresIn } = await hostApiIns.post(
            '/api/token/refreshToken',
            {
              rfToken: oldRfToken,
            }
          );

          await persistRefreshToken(refreshToken, refreshExpiresIn);
          hostApiIns.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          // storage
          await _initializeSilentRefreshToken(expiresIn);

          return await hostApiIns(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
  }
  // response?.data?.data ?? response?.data, //? first data is belong to axios, second data is belong to app-api
  // (error) => {
  //   const originalConfig = error.config;
  //   const errorData = error.response && error.response.data;
  //   if (!errorData) {
  //     return Promise.reject(
  //       new AppApiError({
  //         message: 'messages.errors.common',
  //       }).getInfo()
  //     );
  //   }
  //   if (originalConfig.url !== '/auth/signin' && errorData.response) {
  //     // Access Token was expired
  //     if (errorData.response.status === 401 && !originalConfig._retry) {
  //       originalConfig._retry = true;

  //       try {
  //         const oldRfToken = await getRefreshToken()!;
  //         const rs = await hostApiIns.post('/auth/refreshtoken', {
  //           rfToken: oldRfToken,
  //         });

  //         const { accessToken } = rs.data;
  //         TokenService.updateLocalAccessToken(accessToken);

  //         return instance(originalConfig);
  //       } catch (_error) {
  //         return Promise.reject(_error);
  //       }
  //     }
  //   }

  //? For DEV
  // console.log('error_response: ', errorData);

  // return Promise.reject(new AppApiError(errorData as ErrorResponse).getInfo());
  //
);

class BaseApi {
  private apiIns: AxiosInstance = hostApiIns;

  constructor(private prefixPath: string) {}

  get<T>(...params: Parameters<typeof axios.get>) {
    const [url, ...resParams] = params;
    return this.apiIns.get<T>(concatPath(this.prefixPath, url), ...resParams);
  }

  post<T>(...params: Parameters<typeof axios.post>) {
    const [url, ...resParams] = params;
    return this.apiIns.post<T>(concatPath(this.prefixPath, url), ...resParams);
  }

  put<T>(...params: Parameters<typeof axios.put>) {
    const [url, ...resParams] = params;
    return this.apiIns.put<T>(concatPath(this.prefixPath, url), ...resParams);
  }

  patch<T>(...params: Parameters<typeof axios.patch>) {
    const [url, ...resParams] = params;
    return this.apiIns.patch<T>(concatPath(this.prefixPath, url), ...resParams);
  }

  delete<T>(...params: Parameters<typeof axios.delete>) {
    const [url, ...resParams] = params;
    return this.apiIns.delete<T>(concatPath(this.prefixPath, url), ...resParams);
  }

  getApiInstance() {
    return this.apiIns;
  }
}

export { BaseApi };
function _initializeSilentRefreshToken(expiresIn: number) {
  throw new Error('Function not implemented.');
}
