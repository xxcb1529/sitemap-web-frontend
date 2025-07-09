// plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase as string) || "/api";

  // 创建带认证的 fetch 实例
  const api = $fetch.create({
    baseURL,
    async onRequest({ options }) {
      const { token } = useUserStore();

      options.headers = {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    },
    async onResponseError({ response }) {
      const { status } = response;

      // 处理认证失败
      if ([401, 403].includes(status)) {
        const userStore = useUserStore();
        await userStore.logout();

        // 安全跳转处理
        if (process.client) {
          await nextTick();
          navigateTo({
            path: "/login",
            query: { redirect: useRouter().currentRoute.value.fullPath },
          });
        }
      }

      // 统一错误格式
      throw createError({
        statusCode: status,
        message: response._data?.message || "API Request Failed",
        fatal: status >= 500,
      });
    },
  });

  return {
    provide: { api },
  };
});
