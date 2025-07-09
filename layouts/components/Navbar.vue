<template>
  <header class="VPNav">
    <div class="VPNavBar has-sidebar">
      <div class="app-header-main container">
        <div class="VPNavBarTitle has-sidebar">
          <a class="title" href="/"
            ><img class="VPImage logo" src="" alt="" />{{ ProjectName }}</a
          >
        </div>
        <div class="content">
          <nav
            aria-labelledby="main-nav-aria-label"
            class="VPNavBarMenu menu mr-5"
          >
            <NuxtLink
              v-for="link in links"
              :key="link.path"
              :to="link.path"
              :target="`${link.isBlank ? '_blank' : ''}`"
              class="VPLink link VPNavBarMenuLink"
              >{{ link.title }}</NuxtLink
            >
          </nav>
        </div>
        <div
          class="w-100 text-right app-header-search flex items-center justify-end ms-2"
        >
          <div class="locale-select w-20 mr-5">
            <client-only>
              <el-select
                v-model="locale"
                placeholder="Select"
                @change="changeLang"
              >
                <el-option
                  v-for="item in langOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </client-only>
          </div>
          <!-- <Search @handleSearch="onSearch" /> -->
          <div>
            <!-- <el-button size="small" type="info" @click="handleAuthClick">{{ userStore.isLogin ? userStore.userInfo.username : "登录" }}</el-button> -->
            <client-only>
              <el-dropdown v-if="userStore.isLogin">
                <span class="el-dropdown-link">
                  {{ userStore.userInfo.username }}
                  <Icon name="ep:arrow-down" class="ml-1" />
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item index="1-1" @click="goUserCenter"
                      >个人中心</el-dropdown-item
                    >
                    <el-dropdown-item index="1-2" divided @click="logout"
                      >退出登录</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button size="small" type="primary" @click="goLogin" v-else
                >登录</el-button
              >
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { langConfig, type LangCode, loadLanguageMessages } from "~/config/lang";
import { useI18n } from "vue-i18n";
import { ProjectName, getRouteLinks } from "@/config";
import { useCookie } from "#app";
// 导入用户信息
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
// 导入路由国际化工具函数
import { useLocalizedRoutes } from "~/composables/useLocalizedRoutes";

const route = useRoute();
const router = useRouter();
const localeRoute = useLocaleRoute();

// 获取路由链接
const links = computed(() => getRouteLinks(t, locale.value, defaultLocale));

// 导入国际化插件工具函数
const { t, locale, setLocaleMessage, availableLocales, defaultLocale } =
  useI18n();
const { getLocalizedPath } = useLocalizedRoutes(locale.value, defaultLocale);

// 获取当前语言
const cookie = useCookie("lang"); // Nuxt3 推荐使用cookie
if (cookie.value) {
  locale.value = cookie.value as LangCode;
}
// 获取当前语言的翻译
const langOptions = computed(() =>
  langConfig.supported.map((lang) => ({
    value: lang.code,
    label: lang.name,
  }))
);

// 加载语言包
const loadLang = async (lang: LangCode) => {
  const messages = await loadLanguageMessages(lang);
  setLocaleMessage(lang, messages);
  if (!availableLocales.includes(lang)) {
    availableLocales.push(lang); // 添加到可用语言列表中
  }
  locale.value = lang as LangCode;
};

// 语言切换跳转页面
const changeLang = async (newLang: LangCode) => {
  if (newLang === cookie.value) return; // 如果语言相同则不切换
  await loadLang(newLang);
  // 延迟加载状态
  await nextTick();
  cookie.value = newLang;
  locale.value = cookie.value as LangCode;
  // 用于把当前页面生成对应的语言前缀的路由,例如:/zh/,/zh/about
  const routePath = localeRoute({
    path: route.fullPath,
    query: { ...route.query },
  });
  if (routePath) {
    return navigateTo(routePath.fullPath); // 路由跳转
  }
};

// 跳转登录
function goLogin() {
  router.push({ path: getLocalizedPath("/login") });
}

function goUserCenter() {
  router.push({ path: getLocalizedPath("/user") });
}

function logout() {
  userStore.logout();
}

// 搜索
// const onSearch = ({ title, navId }: any) => {
//   router.push({ path: `/search/${title}`, query: { navId } });
// };
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  border: none;
}
</style>
