<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const { authUser } = storeToRefs(authStore);
</script>

<template>
  <div>
    <h1>Home</h1>

    <template v-if="authUser">
      <p>ID: {{ authUser.uid }}</p>
      <p>Email: {{ authUser.email }}</p>
      <p>Name: {{ authUser.displayName }}</p>
    </template>
  </div>
</template>
