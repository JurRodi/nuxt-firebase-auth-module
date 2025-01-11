export default defineNuxtRouteMiddleware(async () => {
  await useAuthStore().initialLoad();
});
