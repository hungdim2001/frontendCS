
import { REFRESH_TOKEN_KEY, REFRESH_TOKEN_EXP_TIME } from 'src/config';

//? Note: Refresh token has uuid format

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getRefreshTokenExpTime = () => {
  const rfMaxAge = localStorage.getItem(REFRESH_TOKEN_EXP_TIME);

  if (!rfMaxAge) return Number.MIN_VALUE;

  return rfMaxAge;
};

export const persistRefreshToken = (newRefreshToken: string, expiresIn: number) => {

  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  const expTime = Date.now() + expiresIn;
  localStorage.setItem(REFRESH_TOKEN_EXP_TIME, expTime + '');
};

export const isValidPersistedRefreshToken = () => {
  const rfToken = getRefreshToken();

  if (!rfToken) return false;

  const expTime = Number(getRefreshTokenExpTime());

  if (Number.isNaN(expTime)) return false;

  return expTime > Date.now();
};
