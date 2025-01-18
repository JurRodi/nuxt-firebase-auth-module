import { assertMethod, defineEventHandler, readBody, setCookie, deleteCookie } from 'h3';
import type { CookieOptions } from 'nuxt/app';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  const { idTokenCookie, refreshTokenCookie } = useRuntimeConfig().firebaseAuth;
  const { idToken, refreshToken } = await readBody(event);

  const idTokenCookieOptions = idTokenCookie.options as CookieOptions;
  const refreshTokenCookieOptions = refreshTokenCookie.options as CookieOptions;

  if (idToken) {
    setCookie(event, idTokenCookie.name, idToken, idTokenCookieOptions);
  } else {
    deleteCookie(event, idTokenCookie.name, idTokenCookieOptions);
  }

  if (refreshToken) {
    setCookie(event, refreshTokenCookie.name, refreshToken, refreshTokenCookieOptions);
  } else {
    deleteCookie(event, refreshTokenCookie.name, refreshTokenCookieOptions);
  }
});
