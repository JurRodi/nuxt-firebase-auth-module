# nuxt-firebase-auth-module

Nuxt 3 module for Google Firebase authentication.

## Features

1. Support for both SPA and SSR
2. Local Firebase emulator support
3. Multi tenancy support
4. No firebase-admin needed with admin permissions in GKE

## Quick Setup

1. Install the package

`pnpm i nuxt-firebase-auth-module firebase`

2. Update nuxt.config.ts

```typescript
{
    modules: ['nuxt-firebase-auth-module'],
    // ...
    firebaseAuth: {
        config: {
            apiKey: '_',
        },
        tenantId: '',
        emulatorHost: 'http://localhost:9099',
    },
}
```

3. Use Firebase auth app in your application

```typescript
const { $auth } = useNuxtApp();

const authUser = ref<FirebaseUser>();

$auth?.onIdTokenChanged((user: User | null) => {
  if (!user) {
    authUser.value = undefined;
    return;
  }

  authUser.value = user.toJSON() as FirebaseUser;
});
```

4. Make sure to await the initial user state, for example in a middleware:

```typescript
# middleware/authstate.global.ts

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth } = useNuxtApp();
  await $auth?.authStateReady();
});
```

## Local development

```bash
pnpm install

pnpm run dev:prepare

cd playground

pnpm run dev
```

## Overriding config with environment variables

Module configuration is mapped onto runtimeConfig -> `runtimeConfig.public.firebaseAuth`

```shell
# .env
NUXT_PUBLIC_FIREBASE_AUTH_CONFIG={"apiKey":"apikeyhere"}
NUXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST="http://localhost:9000"
NUXT_PUBLIC_FIREBASE_AUTH_TENANT_ID="tenantname"
```

---

Generated using `npx nuxi init -t module` https://nuxt.com/docs/guide/going-further/modules#using-the-starter
