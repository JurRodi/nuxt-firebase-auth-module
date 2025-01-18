import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addServerHandler,
  addServerPlugin,
} from '@nuxt/kit';
import type { FirebaseOptions } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { CookieOptions } from 'nuxt/app';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'firebase-auth',
    configKey: 'firebaseAuth',
  },
  defaults: {},
  setup(options, nuxt) {
    if (!options.public) {
      throw new Error(
        `[nuxt-firebase-auth]: options.public is required to use this module, see project readme for example usage: https://github.com/JRaams/nuxt-firebase-auth-module`,
      );
    }

    if (!options.public.authCookieEndpoint.startsWith('/api')) {
      throw new Error(
        `[nuxt-firebase-auth]: authCookieEndpoint should start with "/api", got: "${options.public.authCookieEndpoint}"`,
      );
    }

    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.firebaseAuth = options.public;

    nuxt.options.runtimeConfig.firebaseAuth = {
      idTokenCookie: {
        name: options.private?.idTokenCookie?.name || 'nfa-id',
        options: {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          ...options.private?.idTokenCookie?.options,
        },
      },
      refreshTokenCookie: {
        name: options.private?.refreshTokenCookie?.name || 'nfa-refresh',
        options: {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
          ...options.private?.refreshTokenCookie?.options,
        },
      },
    };

    addPlugin(resolver.resolve('./runtime/plugins/auth.client'));

    if (nuxt.options.ssr) {
      addPlugin(resolver.resolve('./runtime/plugins/auth.server'));

      addServerHandler({
        route: nuxt.options.runtimeConfig.public.firebaseAuth.authCookieEndpoint,
        handler: resolver.resolve('./runtime/server/api/authcookie.post'),
      });

      addServerPlugin(resolver.resolve('./runtime/server/plugins/hooks'));
    }
  },
});

export interface ModuleOptions {
  public: {
    config: FirebaseOptions;
    tenantId?: string;
    emulatorHost?: string;
    authCookieEndpoint: string;
  };
  private?: {
    idTokenCookie?: {
      name?: string;
      options?: CookieOptions;
    };
    refreshTokenCookie?: {
      name?: string;
      options?: CookieOptions;
    };
  };
}

interface NuxtFirebasePublicRuntimeConfig {
  firebaseAuth: ModuleOptions['public'];
}

interface NuxtFirebaseRuntimeConfig {
  firebaseAuth: {
    idTokenCookie: {
      name: string;
      options: CookieOptions;
    };
    refreshTokenCookie: {
      name: string;
      options: CookieOptions;
    };
  };
}

declare module '@nuxt/schema' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PublicRuntimeConfig extends NuxtFirebasePublicRuntimeConfig {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface RuntimeConfig extends NuxtFirebaseRuntimeConfig {}
}

declare module '#app' {
  interface NuxtApp {
    $auth: Auth | undefined;
  }
}
