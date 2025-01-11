# nuxt-firebase-auth-module

Nuxt 3 module for firebase authentication.

Main features:

1. Support for both SPA and SSR
2. Local firebase emulator support
3. Multi tenancy support
4. No firebase-admin needed with admin permissions in GKE

## Overriding config with environment variables

Module configuration is mapped onto runtimeConfig -> `runtimeConfig.public.firebaseAuth`

```shell
# .env
NUXT_PUBLIC_FIREBASE_AUTH_CONFIG={"apiKey":"apikeyhere"}
NUXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST="http://localhost:9000"
NUXT_PUBLIC_FIREBASE_AUTH_TENANT_ID="tenantname"
```

Generated using `npx nuxi init -t module` https://nuxt.com/docs/guide/going-further/modules#using-the-starter
