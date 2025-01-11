import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addServerHandler,
  addServerPlugin,
} from '@nuxt/kit';
import type { FirebaseOptions } from 'firebase/app';
import type { Auth } from 'firebase/auth';

export interface ModuleOptions {
  config: FirebaseOptions;
  tenantId?: string;
  emulatorHost?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'firebase-auth',
    configKey: 'firebaseAuth',
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    _nuxt.options.runtimeConfig.public.firebaseAuth = _options;

    addPlugin(resolver.resolve('./runtime/plugins/auth.client'));

    if (_nuxt.options.ssr) {
      addPlugin(resolver.resolve('./runtime/plugins/auth.server'));

      addServerHandler({
        route: '/api/authcookie',
        handler: resolver.resolve('./runtime/server/api/authcookie.post'),
      });

      addServerPlugin(resolver.resolve('./runtime/server/plugins/hooks'));
    }
  },
});

interface NuxtFirebasePublicRuntimeConfig {
  firebaseAuth: ModuleOptions;
}

declare module '@nuxt/schema' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PublicRuntimeConfig extends NuxtFirebasePublicRuntimeConfig {}
}

declare module '#app' {
  interface NuxtApp {
    $auth: Auth;
  }
}
