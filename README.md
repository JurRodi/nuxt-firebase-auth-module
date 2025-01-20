<img align="right" height="100" src="./docs/frog.png">

# Nuxt Firebase Auth

[![publish to npm](https://github.com/JRaams/nuxt-firebase-auth-module/actions/workflows/publish.yml/badge.svg)](https://github.com/JRaams/nuxt-firebase-auth-module/actions/workflows/publish.yml)

Nuxt 3 module for Google Firebase authentication.

## 1. Features

1. Support for both SPA and SSR
2. Local Firebase emulator support
3. Multi tenancy support
4. No firebase-admin needed with admin permissions in GKE

## 2. Quick Setup

1. Install the package

`pnpm i nuxt-firebase-auth firebase`

2. Update nuxt.config.ts

```typescript
{
  modules: ['nuxt-firebase-auth'],
  // ...
  firebaseAuth: {
    public: {
      config: {
        apiKey: '-',
      },
      authCookieEndpoint: '/api/authCookie',
      emulatorHost: 'http://localhost:9099',
    },
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

## 3. Local development

### a. Starting the playground

```bash
pnpm install

pnpm run dev
```

Visit the playground on: http://localhost:3000/

### b. Starting a local auth emulator

If you want to use a local Firebase auth emulator instead of an online Firebase instance:

```bash
cd playground

docker compose up
```

Visit the auth emulator ui on: http://localhost:4000/auth

## 4. Overriding config with environment variables

Module configuration is mapped onto the runtimeConfig:

```json
{
  "public": {
    "firebaseAuth": {
      "config": {
        "apiKey": "_"
      },
      "tenantId": "",
      "emulatorHost": "http://localhost:9099",
      "authCookieEndpoint": "/api/authcookie"
    }
  },
  "firebaseAuth": {
    "idTokenCookie": {
      "name": "nfa-id",
      "options": {
        "httpOnly": true,
        "sameSite": "strict",
        "secure": true
      }
    },
    "refreshTokenCookie": {
      "name": "nfa-refresh",
      "options": {
        "httpOnly": true,
        "sameSite": "strict",
        "secure": true
      }
    }
  }
}
```

```shell
# public
NUXT_PUBLIC_FIREBASE_AUTH_CONFIG={"apiKey":"apikeyhere"}
NUXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST="http://localhost:9099"
NUXT_PUBLIC_FIREBASE_AUTH_TENANT_ID="tenantname"

# private
NUXT_FIREBASE_AUTH_ID_TOKEN_COOKIE_NAME="nfa-id"
NUXT_FIREBASE_AUTH_ID_TOKEN_COOKIE_OPTIONS={"httpOnly": true,"sameSite": "strict","secure": true}
NUXT_FIREBASE_AUTH_REFRESH_TOKEN_COOKIE_NAME="nfa-refresh"
NUXT_FIREBASE_AUTH_REFRESH_TOKEN_COOKIE_OPTIONS={"httpOnly": true,"sameSite": "strict","secure": true}
```
