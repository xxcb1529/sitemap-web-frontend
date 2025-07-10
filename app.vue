<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPage />
  </div>
</template>
<script lang="ts" setup>
import { initGlobalT } from "~/composables/useGlobalI18n";

initGlobalT();
</script>
