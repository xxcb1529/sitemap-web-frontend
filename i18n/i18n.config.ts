import { createI18n } from "vue-i18n";
import type { FallbackLocale } from "vue-i18n";
import { langConfig } from "../config/lang";

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: langConfig.default as FallbackLocale,
  globalInjection: true,
}));
