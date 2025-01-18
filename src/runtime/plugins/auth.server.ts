import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports';
import { initializeServerApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const firebaseAuthConfig = useRuntimeConfig().public.firebaseAuth;

  const authIdToken = await loadIdToken();

  const app = initializeServerApp(firebaseAuthConfig.config, {
    authIdToken,
  });

  const auth = getAuth(app);

  if (firebaseAuthConfig.tenantId) {
    auth.tenantId = firebaseAuthConfig.tenantId;
  }

  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.event.context.firebaseServerApp = app;
  }

  if (firebaseAuthConfig.emulatorHost && !auth.emulatorConfig) {
    connectAuthEmulator(auth, firebaseAuthConfig.emulatorHost, { disableWarnings: true });
  }

  return {
    provide: {
      auth: auth as Auth | undefined,
    },
  };
});

async function loadIdToken(): Promise<string | undefined> {
  const { idTokenCookie } = useRuntimeConfig().firebaseAuth;
  const cookieValue = useCookie(idTokenCookie.name).value;

  if (cookieValue) {
    try {
      const exp = JSON.parse(atob(cookieValue.split('.')[1])).exp;
      if (new Date(exp * 1000) > new Date()) {
        return cookieValue;
      }
    } catch {
      //
    }
  }

  return tryRefreshToken();
}

async function tryRefreshToken(): Promise<string | undefined> {
  const { refreshTokenCookie } = useRuntimeConfig().firebaseAuth;
  const refreshToken = useCookie(refreshTokenCookie.name).value;
  if (!refreshToken) return undefined;

  const firebaseAuthConfig = useRuntimeConfig().public.firebaseAuth;

  const tokenUrl = firebaseAuthConfig.emulatorHost
    ? `${firebaseAuthConfig.emulatorHost}/securetoken.googleapis.com/v1/token`
    : 'https://securetoken.googleapis.com/v1/token';

  const url = new URL(tokenUrl);
  if (firebaseAuthConfig.config.apiKey) {
    url.searchParams.append('key', firebaseAuthConfig.config.apiKey);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  }).catch(() => {});

  if (!response || !response.ok) return undefined;

  const body = await response.json();
  if (!body) return undefined;

  return body.id_token;
}
