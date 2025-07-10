// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { langConfig } from "./config/lang";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  modules: [
    [
      "@nuxtjs/i18n",
      {
        locales: langConfig.supported,
        defaultLocale: langConfig.default,
        strategy: "prefix_and_default", // 添加路由前缀的方式
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: "lang",
          redirectOn: "root",
        },
        lazy: true,
        langDir: "locales/",
        vueI18n: "~/i18n/i18n.config.ts",
      },
    ],
    "nuxt-lodash",
    "nuxt-icon",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  plugins: ["@/plugins/element-plus"],
  // 全局设置的 CSS 文件
  css: [
    "@/assets/css/index.scss",
    "element-plus/theme-chalk/base.css",
    "@/assets/css/element/index.scss",
    "animate.css",
  ],
  imports: {
    dirs: ["stores/**.{ts,js,mjs,mts}"],
  },
  vite: {
    plugins: [
      // ...
      Components({
        resolvers: [IconsResolver(), ElementPlusResolver()],
      }),
      Icons({ autoInstall: true }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/assets/css/variable.scss" as *;
          @use "@/assets/css/mixin.scss" as *;
        `,
        },
      },
    },
    ssr: {
      noExternal: ["moment", /element-plus/, "lodash-es"],
    },
    optimizeDeps: {
      exclude: ["@vue/devtools-api"],
    },
  },
});
