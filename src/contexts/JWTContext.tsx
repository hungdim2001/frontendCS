import { createContext, ReactNode, useEffect, useReducer, useRef } from 'react';
// utils
import axios from '../utils/axios';
import useAuth from '../hooks/useAuth';

import { isValidToken, setSession } from '../utils/jwt';
// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth';
import { authApi, RefreshTokenBody } from 'src/service/app-apis/auth';
import { getRefreshToken, isValidPersistedRefreshToken, persistRefreshToken } from 'src/utils/refreshTokenStorage';
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_PRE_TIME } from 'src/config';
import { email } from 'src/_mock/email';

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

const createAuthChannel = () => {
  const rfAuthEventKey = 'refresh_auth';

  const handleAuthChannel = (event: StorageEvent) => {
    if (event.key === rfAuthEventKey) {
      window.location.reload();
    }
  };
  return {
    subscribe: () => {
      window.addEventListener('storage', handleAuthChannel);
    },
    unSubscribe: () => {
      window.removeEventListener('storage', handleAuthChannel);
    },
    triggerAuthRefreshing: () => {
      console.log("refresh")
      window.localStorage.setItem(rfAuthEventKey, Date.now().toString());
    },
  };
};
function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const _silentRefreshTokenId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authChannel = createAuthChannel();

  const _clearSilentRefreshToken = () => {
    if (!!_silentRefreshTokenId.current) {

      clearTimeout(_silentRefreshTokenId.current);
    }
  };
  const _initializeSilentRefreshToken = (timeOut: number) => {
    _clearSilentRefreshToken();
    _silentRefreshTokenId.current = setTimeout(async () => {
      try {
        await refreshToken();
      } catch (error) {
        //? For-dev
        console.error('_silent_rftk_error: ', error);
      }
    }, timeOut);
  };
  const refreshToken = async () => {
    if (!isValidPersistedRefreshToken()) {
      setTimeout(() => dispatch({ type: Types.Logout }), 1500);
      throw new Error('Persisted refresh token is invalid.');
    }
    const oldRfToken = getRefreshToken()!;
    try {
      // apis
      const { accessToken, refreshToken, expiresIn, refreshExpiresIn } =
        await authApi.refreshToken({
          rfToken: oldRfToken,
        } as RefreshTokenBody);
      await persistRefreshToken(refreshToken, refreshExpiresIn);
      authApi.setSession({ accessToken })
      await  authApi.updateRefreshToken({rfToken:oldRfToken, newRFToken:refreshToken})
     // storage
     await _initializeSilentRefreshToken(expiresIn);
    } catch (error) {
      throw error;
    }

  }
  useEffect(() => {
    const initialize = async () => {
      try {
        if (isValidPersistedRefreshToken()) {
          await refreshToken();
          const user = await authApi.whoAmI();
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });

          return;
        }

        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      } catch (err) {
        //? For-Dev
        // console.error('_auth_initialize_error: ', err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
    authChannel.subscribe();
    return () => authChannel.unSubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const login = async (account: string, password: string, userInfo?: AuthUser) => {
    const isAfterRegister = !!userInfo;

    const response = await authApi.login({
      account,
      password,
    });
    const { accessToken, refreshExpiresIn, refreshToken, expiresIn } = response;
    const rftkTimeout = expiresIn - REFRESH_TOKEN_PRE_TIME * 10000;

    // auth-session
    authApi.setSession({ accessToken });

    // storage
    const user = isAfterRegister ? userInfo : await authApi.whoAmI();

    persistRefreshToken(refreshToken, refreshExpiresIn);
    _initializeSilentRefreshToken(rftkTimeout);

    // auth-user-info
    !isAfterRegister &&
      dispatch({
        type: Types.Login,
        payload: {
          user,
        },
      });

    // auth-channel
    authChannel.triggerAuthRefreshing();

  };

  const register = async (
    id: number|null,
    email: string,
    phone: string,
    areaCode: string,
    role:string,
    password: string,
    firstName: string,
    lastName: string) => {
    const response = await authApi.register({ id,
      email, phone,
      areaCode, role,password, firstName
      , lastName
    })
    await login(email, password, response);
    dispatch({
      type: Types.Register,
      payload: {
        user: response,
      },
    });
  };

  const logout = async () => {
    const rftoken = localStorage.getItem(REFRESH_TOKEN_KEY)
    // apis
    await authApi.logout({
      token: rftoken!,
    });
    authApi.setSession(null);

    // storage
    _clearSilentRefreshToken();
    dispatch({ type: Types.Logout });
     localStorage.removeItem(REFRESH_TOKEN_KEY)

    // auth-channel
    authChannel.triggerAuthRefreshing();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
