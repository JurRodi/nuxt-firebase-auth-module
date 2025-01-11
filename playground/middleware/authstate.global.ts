export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  await authStore.initialLoad();

  if (to.name === 'index' && authStore.authState !== 'authenticated') {
    return navigateTo({ name: 'login' });
  }

  if (to.name === 'login' && authStore.authState === 'authenticated') {
    return navigateTo({ name: 'index' });
  }
});
