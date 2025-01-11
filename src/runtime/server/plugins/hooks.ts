import { defineNitroPlugin } from 'nitropack/runtime';
import { deleteApp } from 'firebase/app';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if (event.context.firebaseServerApp) {
      deleteApp(event.context.firebaseServerApp);
      event.context.firebaseServerApp = undefined;
    }
  });
});
