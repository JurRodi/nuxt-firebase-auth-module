import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type User } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const firebaseAuthConfig = useRuntimeConfig().public.firebaseAuth;

  const firebaseApp = initializeApp(firebaseAuthConfig.config);
  const auth = getAuth(firebaseApp);

  if (firebaseAuthConfig.tenantId) {
    auth.tenantId = firebaseAuthConfig.tenantId;
  }

  if (firebaseAuthConfig.emulatorHost && !auth.emulatorConfig) {
    connectAuthEmulator(auth, firebaseAuthConfig.emulatorHost);
  }

  auth.onIdTokenChanged(async (user: User | null) => {
    try {
      // @ts-expect-error Firebase types don't expose the token manager
      const idToken = user?.stsTokenManager?.accessToken;
      // @ts-expect-error Firebase types don't expose the token manager
      const refreshToken = user?.stsTokenManager?.refreshToken;

      await $fetch(firebaseAuthConfig.authCookieEndpoint, {
        method: 'POST',
        body: {
          idToken,
          refreshToken,
        },
      });
    } catch {
      //
    }
  });

  return {
    provide: {
      auth,
    },
  };
});
