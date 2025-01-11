<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const { authState } = storeToRefs(authStore);
</script>

<template>
  <nav>
    <ul>
      <li><strong>Nuxt Firebase Auth</strong></li>
    </ul>
    <ul>
      <li v-if="authState === 'authenticated'">
        <button type="button" @click="authStore.logout()">Logout</button>
      </li>
    </ul>
  </nav>
</template>
