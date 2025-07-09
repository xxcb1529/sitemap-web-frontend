// composables/useLocalizedRoutes.ts
import type { Locale } from "vue-i18n";

export const useLocalizedRoutes = (locale: string, defaultLocale: string) => {
  // 生成带语言前缀的路径
  const getLocalizedPath = (rawPath: string, targetLocale?: Locale) => {
    const finalLocale = targetLocale || locale;
    const cleanPath = rawPath.replace(/^\/+/, ""); // 移除开头斜杠

    // 默认语言不加前缀
    if (finalLocale === defaultLocale) return `/${cleanPath}` || "/";

    // 其他语言添加前缀
    return `/${finalLocale}/${cleanPath}`.replace(/\/+/g, "/");
  };

  return { getLocalizedPath };
};
