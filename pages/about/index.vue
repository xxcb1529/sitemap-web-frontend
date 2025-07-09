<template>
  <NuxtLayout>
    <div class="app-home-hero">
      <div class="container flex"></div>
    </div>
    <div class="app-home-body">
      <div class="container relative flex">{{ t("test") }}</div>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
