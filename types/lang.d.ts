// types/lang.d.ts
import type { LangCode } from "~/config/lang";

declare module "@nuxtjs/i18n" {
  interface NuxtI18nOptions {
    locales: LangCode[];
  }
}
