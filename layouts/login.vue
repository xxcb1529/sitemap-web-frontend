<template>
  <div id="root">
    <div class="app-main">
      <slot />
    </div>
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Footer from "./components/Footer.vue";
</script>
<style lang="scss" scoped></style>
