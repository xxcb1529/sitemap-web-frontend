<template>
  <NuxtLayout>
    <div class="login-content flex items-center justify-center bg-gray-100">
      <client-only>
        <div
          class="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg animate__animated animate__fadeIn"
        >
          <h2 class="text-3xl font-bold text-center mb-2">
            欢迎来到 LED 信息库
          </h2>
          <p class="text-gray-500 text-center mb-6">
            请输入您的账户信息进行登录
          </p>

          <el-form label-position="top" class="space-y-4">
            <el-form-item label="邮箱">
              <el-input v-model="email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="密码">
              <el-input
                v-model="password"
                type="password"
                show-password
                placeholder="请输入密码"
              />
            </el-form-item>

            <el-button
              type="primary"
              class="w-full"
              size="large"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form>

          <div
            class="flex justify-between items-center text-sm text-gray-500 mt-4"
          >
            <a href="#" @click.prevent="goRegister">注册新账户</a>
            <a href="#" @click.prevent="handleReset">忘记密码？</a>
          </div>
        </div>
      </client-only>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { useLocalizedRoutes } from "~/composables/useLocalizedRoutes";
const { t, locale, defaultLocale } = useI18n();
const { getLocalizedPath } = useLocalizedRoutes(locale.value, defaultLocale);
definePageMeta({
  layout: "login",
  ssr: false,
});
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const email = ref("");
const password = ref("");
const loading = ref(false);

function handleLogin() {
  if (!email.value || !password.value) {
    ElMessage.warning("请输入邮箱和密码");
    return;
  }

  loading.value = true;

  // 模拟请求延迟
  setTimeout(() => {
    userStore.login({
      token: "mock-token-123",
      userInfo: {
        username: email.value.split("@")[0],
      },
    });

    ElMessage.success("登录成功");
    loading.value = false;
    // 返回上一页（如果有历史），否则跳转到首页
    if (route.redirectedFrom) {
      router.push(route.redirectedFrom.fullPath);
    } else if (document.referrer && window.history.length > 1) {
      router.back(); // 或 window.history.back()
    } else {
      router.push("/");
    }
  }, 1000);
}

function goRegister() {
  router.push({ path: getLocalizedPath("/register") });
}

function handleReset() {
  ElMessage.info("找回密码功能待开发 🛠️");
}
</script>

<style scoped>
.login-content {
  min-height: calc(100vh - 77px);
  box-sizing: border-box;
}
a {
  cursor: pointer;
  transition: color 0.2s;
}
a:hover {
  color: #6d4b98;
}
</style>
