<template>
  <NuxtLayout>
    <div class="register-content flex items-center justify-center bg-gray-100">
      <client-only>
        <div
          class="bg-white p-6 rounded shadow animate__animated animate__fadeIn w-full max-w-md"
        >
          <h1 class="text-2xl font-bold mb-4">注册账户</h1>

          <el-form label-position="top" class="space-y-4">
            <el-form-item label="用户名">
              <el-input v-model="username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                v-model="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
            <el-button
              type="primary"
              class="w-full"
              size="large"
              @click="handleRegister"
              >注册</el-button
            >
            <p class="text-sm mt-2">
              已有账号？<NuxtLink to="/login" class="primary-color"
                >去登录</NuxtLink
              >
            </p>
          </el-form>
        </div>
      </client-only>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
definePageMeta({
  layout: "login",
  ssr: false,
});
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");

function handleRegister() {
  if (!username.value || !email.value || !password.value) {
    ElMessage.warning("请完整填写信息");
    return;
  }

  // 模拟注册逻辑
  ElMessage.success("注册成功，自动跳转到登录页");
  setTimeout(() => router.push("/login"), 1000);
}
</script>
<style scoped lang="scss">
.register-content {
  min-height: calc(100vh - 77px);
  box-sizing: border-box;
}
</style>
