<script setup lang="ts">
import NavBar from './components/NavBar.vue';

import '@picocss/pico/css/pico.orange.min.css';
</script>

<template>
  <NavBar class="container" />

  <main class="container">
    <NuxtPage />
  </main>
</template>
