export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '../src/module'],
  ssr: true,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      firebaseAuth: {
        config: {
          apiKey: '_',
        },
        tenantId: '',
        emulatorHost: 'http://localhost:9099',
      },
    },
  },
  compatibilityDate: '2025-01-09',
  myModule: {},
});
