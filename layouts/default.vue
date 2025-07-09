<template>
  <div id="root">
    <Navbar />
    <div class="app-main">
      <slot />
    </div>
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>
<style lang="scss" scoped></style>
