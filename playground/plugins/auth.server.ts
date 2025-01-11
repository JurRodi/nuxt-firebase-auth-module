import { initializeServerApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const firebaseAuthConfig = useRuntimeConfig().public.firebaseAuth;

  const authIdToken = await loadIdToken();

  const app = initializeServerApp(firebaseAuthConfig.config, {
    authIdToken,
    releaseOnDeref: nuxtApp.ssrContext?.event.node.req,
  });

  const auth = getAuth(app);

  if (firebaseAuthConfig.tenantId) {
    auth.tenantId = firebaseAuthConfig.tenantId;
  }

  // TODO
  if (firebaseAuthConfig.emulatorHost && auth._canInitEmulator) {
    connectAuthEmulator(auth, firebaseAuthConfig.emulatorHost, { disableWarnings: true });
  }

  return {
    provide: {
      auth,
    },
  };
});

async function loadIdToken(): Promise<string | undefined> {
  const cookieValue = useCookie('nfa-id').value;

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
  const refreshToken = useCookie('nfa-refresh').value;
  if (!refreshToken) return undefined;

  const firebaseAuthConfig = useRuntimeConfig().public.firebaseAuth;

  const tokenUrl = firebaseAuthConfig.emulatorHost
    ? `${firebaseAuthConfig.emulatorHost}/securetoken.googleapis.com/v1/token`
    : 'https://securetoken.googleapis.com/v1/token';

  const url = new URL(tokenUrl);
  url.searchParams.append('key', firebaseAuthConfig.config.apiKey);

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
