import pkg from "../package.json";
import { useLocalizedRoutes } from "~/composables/useLocalizedRoutes";
// 顶部菜单
export function getRouteLinks(
  t: (key: string) => string,
  locale: string,
  defaultLocale: string
) {
  const { getLocalizedPath } = useLocalizedRoutes(locale, defaultLocale);
  return [
    { title: t("home"), path: getLocalizedPath("/") },
    { title: t("about"), path: getLocalizedPath("/about"), isBlank: false },
  ];
}
// 编辑菜单
export const TopList = [
  { value: 1, name: "admin", title: "管理后台", class: "el-button--primary" },
  { value: 2, name: "ui", title: "UI组件库", class: "el-button--success" },
  {
    value: 3,
    name: "hooks",
    title: "Hooks工具集",
    class: "el-button--warning",
  },
  { value: 4, name: "cli", title: "Cli", class: "el-button--primary" },
  { value: 5, name: "uniapp", title: "UniApp", class: "el-button--success" },
  { value: 6, name: "tool", title: "JS工具库", class: "el-button--primary" },
];

export const CodeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

// 基础配置
export default {
  name: pkg.name,
  version: pkg.version,
  title: "LED 信息库",
  author: "",
  description: "",
  keywords: "",
};

// 版本
export const APP_VERSION = pkg.version;
// 空白页面
export const BlankList = ["/example/blank"];
// 项目名称
export const ProjectName = "LED 信息库";
export const ProjectTitle = ProjectName.replace(/\s+/g, "");

// 存储key
export const StoreKey = `${ProjectTitle}-${APP_VERSION}`;
export const LoginPath = "/login";
// 公告板
export const HomePath = "/basic/dashboard";
// 开源地址
export const Github = "";
export const Gitee = "";
// 分页配置
export const BasePagination = { page: 1, limit: 8 };
// 协议
export const Protocol = "http";
// 域名
export const Domain = "vue-admin.cn";
// APPID
export const App_Id = 1;
// 标签颜色
export const TagColorList = [
  "red",
  "orangered",
  "orange",
  "deeppink",
  "lightcoral",
  "green",
  "cornflowerblue",
  "blue",
  "darkslategrey",
  "purple",
  "pinkpurple",
  "magenta",
  "gray",
  "darkolivegreen",
  "lightseagreen",
];
