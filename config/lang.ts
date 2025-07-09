// config/lang.ts
export const langConfig = {
  default: "zh",

  supported: [
    { code: "en", name: "English", file: "en.json" },
    { code: "zh", name: "中文", file: "zh-CN.json" },
  ] as const,
};

export type LangCode = (typeof langConfig.supported)[number]["code"];
export const supportedLangCodes = langConfig.supported.map((l) => l.code);

const langFiles: Record<LangCode, () => Promise<any>> = {
  en: () => import("~/i18n/locales/en.json"),
  zh: () => import("~/i18n/locales/zh-CN.json"),
};

export const loadLanguageMessages = async (lang: LangCode) => {
  const loader = langFiles[lang];
  if (!loader) throw new Error(`No language loader for ${lang}`);
  const messages = await loader();
  return messages.default;
};
