<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const { authUser, authState, isAuthorized } = storeToRefs(authStore);
</script>

<template>
  <div>
    <button type="button" @click="authStore.login('test@test.com', 'testtest')">Login</button>
    <button type="button" @click="authStore.logout()">Logout</button>
  </div>

  <div>authState: {{ authState }}, isAuthorized: {{ isAuthorized }}</div>

  <pre>{{ JSON.stringify(authUser, null, 2) }}</pre>
</template>
