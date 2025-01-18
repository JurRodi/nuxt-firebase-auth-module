export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '../src/module'],
  ssr: true,
  devtools: { enabled: true },
  compatibilityDate: '2025-01-09',
  experimental: { appManifest: false },
  firebaseAuth: {
    public: {
      config: {
        apiKey: '_',
      },
      tenantId: '',
      emulatorHost: 'http://localhost:9099',
      authCookieEndpoint: '/api/authcookie',
    },
    private: {
      idTokenCookie: {
        name: 'nfa-id',
        options: {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        },
      },
      refreshTokenCookie: {
        name: 'nfa-refresh',
        options: {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        },
      },
    },
  },
});
