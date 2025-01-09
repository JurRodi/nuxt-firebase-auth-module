import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
  const firebaseAuthConfig = useRuntimeConfig().public.firebaseAuth;

  const firebaseApp = initializeApp(firebaseAuthConfig.config);
  const auth = getAuth(firebaseApp);
  if (firebaseAuthConfig.tenantId) {
    auth.tenantId = firebaseAuthConfig.tenantId;
  }

  if (firebaseAuthConfig.emulatorHost) {
    connectAuthEmulator(auth, firebaseAuthConfig.emulatorHost);
  }

  return {
    provide: {
      auth,
    },
  };
});
