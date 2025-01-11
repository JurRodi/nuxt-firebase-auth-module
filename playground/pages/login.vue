<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const email = ref('test@test.com');
const password = ref('testtest');

async function login() {
  await authStore.login(email.value, password.value);
  navigateTo({ name: 'index' });
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login()">
      <input v-model="email" type="email" />
      <input v-model="password" type="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>
