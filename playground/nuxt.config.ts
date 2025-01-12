export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '../src/module'],
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2025-01-09',
  experimental: { appManifest: false },
  firebaseAuth: {
    config: {
      apiKey: '_',
    },
    tenantId: '',
    emulatorHost: 'http://localhost:9099',
  },
});
