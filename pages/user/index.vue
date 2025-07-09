<template>
  <div class="container mx-auto p-10">
    <div class="bg-white p-6 rounded shadow animate__animated animate__fadeIn">
      <h1 class="text-2xl font-bold mb-4">个人中心</h1>
      <p>👋 欢迎你，{{ userStore.userInfo.username }}</p>
      <el-button type="danger" class="mt-4" @click="handleLogout"
        >退出登录</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();

function handleLogout() {
  userStore.logout();
  router.push("/login");
}
</script>
