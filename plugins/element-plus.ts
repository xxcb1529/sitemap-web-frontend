// plugins/element-plus.ts
import type { LangCode } from "../config/lang";
import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import type { Language } from "element-plus/es/locale";
import { defineNuxtPlugin, useCookie } from "#app";
const localeMap: Record<string, Language> = {
  zh: zhCn,
  en,
};
export default defineNuxtPlugin((nuxtApp) => {
  const langCookie = useCookie("lang");
  const currentLocale = langCookie.value || "zh";
  nuxtApp.vueApp.use(ElementPlus, {
    locale: localeMap[currentLocale],
    size: "default",
  });

  // SSR 下唯一 ID 注入，避免冲突
  nuxtApp.vueApp.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0,
  });

  // SSR 中避免 zIndex 不一致的 hydration 问题
  nuxtApp.vueApp.provide(ZINDEX_INJECTION_KEY, {
    current: 2000, // 从 Element Plus 默认起点（2000）开始
  });

  nuxtApp.hook("i18n:localeSwitched", ({ newLocale }) => {
    const newElementLocale = localeMap[newLocale];
    if (newElementLocale) {
      nuxtApp.vueApp.use(ElementPlus, {
        locale: newElementLocale,
      });
    }
  });
});
