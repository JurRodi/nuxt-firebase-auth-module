import { signInWithEmailAndPassword, type User } from 'firebase/auth';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const { $auth } = useNuxtApp();

  const authUser = ref<User>();
  const authState = ref<'loading' | 'unauthenticated' | 'authenticated'>('loading');
  const isAuthorized = computed<boolean>(() => authState.value === 'authenticated');

  $auth?.onIdTokenChanged((user: User | null) => {
    if (!user) {
      authUser.value = undefined;
      authState.value = 'unauthenticated';
      return;
    }

    authUser.value = user;
    authState.value = 'authenticated';
  });

  async function initialLoad() {
    await $auth?.authStateReady();
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword($auth, email, password);
  }

  async function getUserAccessToken(): Promise<string | undefined> {
    return $auth.currentUser?.getIdToken();
  }

  async function logout() {
    await $auth?.signOut();
  }

  return {
    authUser,
    authState,
    isAuthorized,

    initialLoad,
    login,
    getUserAccessToken,
    logout,
  };
});
