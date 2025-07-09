import { langConfig, type LangCode } from "~/config/lang";
import { useI18n } from "vue-i18n";
// middleware/lang.ts
export default defineNuxtRouteMiddleware((to) => {
  const { locale, defaultLocale } = useI18n();
  const cookie = useCookie<LangCode>("lang");

  // 1. 从路径解析语言
  const pathSegments = to.path.split("/").filter(Boolean);
  const pathLang = pathSegments[0] as LangCode | undefined;

  // 2. 验证并设置语言
  if (pathLang && langConfig.supported.some((l) => l.code === pathLang)) {
    cookie.value = pathLang;
    locale.value = pathLang;
  } else if (cookie.value) {
    locale.value = cookie.value;
  }

  // 3. 自动重定向到正确路径
  const { getLocalizedPath } = useLocalizedRoutes();
  const expectedPath = getLocalizedPath(to.path);
  if (to.path !== expectedPath) {
    return navigateTo({
      path: expectedPath,
      query: to.query,
    });
  }
});
