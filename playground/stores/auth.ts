import { signInWithEmailAndPassword, type User } from 'firebase/auth';
import { defineStore } from 'pinia';
import type { FirebaseUser } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const { $auth } = useNuxtApp();

  const authUser = ref<FirebaseUser>();
  const authState = ref<'loading' | 'unauthenticated' | 'authenticated'>('loading');

  $auth?.onIdTokenChanged((user: User | null) => {
    if (!user) {
      authUser.value = undefined;
      authState.value = 'unauthenticated';
      return;
    }

    authUser.value = user.toJSON() as FirebaseUser;
    authState.value = 'authenticated';
  });

  async function initialLoad() {
    await $auth?.authStateReady();
  }

  async function login(email: string, password: string) {
    if (!$auth) return;
    await signInWithEmailAndPassword($auth, email, password);
  }

  async function getUserAccessToken(): Promise<string | undefined> {
    if (!$auth) return;
    return $auth.currentUser?.getIdToken();
  }

  async function logout() {
    if (!$auth) return;
    await $auth.signOut();
    window.location.reload();
  }

  return {
    authUser,
    authState,

    initialLoad,
    login,
    getUserAccessToken,
    logout,
  };
});
