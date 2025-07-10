import { useI18n } from "vue-i18n";

let globalT: ReturnType<typeof useI18n>["t"];

/**
 * 初始化 global t() 函数
 * 只需要在 app 启动时 setup 里调用一次
 */
export const initGlobalT = () => {
  if (!globalT) {
    const { t } = useI18n();
    globalT = t;
  }
};

/**
 * 在 ts 文件中直接使用 t()
 */
export const useGlobalT = () => {
  if (!globalT) {
    throw new Error(
      "useGlobalT() 还没有初始化，请先在应用初始化阶段调用 initGlobalT()"
    );
  }
  return globalT;
};
