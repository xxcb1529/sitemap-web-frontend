<template>
  <div class="app-footer">
    <div class="container flex items-center justify-between app-footer-content">
      <div class="app-footer-logo">
        <el-space :size="15">
          <NuxtLink
            v-for="link in state.links"
            :key="link.url"
            :href="link.url"
            class="url"
            :title="link.title"
            target="_blank"
          >
            <el-space :size="5">
              <Icon name="mdi:link-variant" size="14" />
              <span>{{ link.title }}</span>
            </el-space>
          </NuxtLink>
        </el-space>
      </div>
      <div class="footer-nav text-xs text-gray-500 space-x-3">
        <template v-for="(link, index) in state.footerLinks" :key="index">
          <NuxtLink :to="link.url" class="hover:underline">{{
            link.label
          }}</NuxtLink>
          <span v-if="index < state.footerLinks.length - 1">|</span>
        </template>
        <span>|</span>
        <span>© {{ state.year }} ams-OSRAM AG 公司</span>
      </div>
      <div class="copyright text-xs">
        <span class="mr-3"
          ><a
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noreferrer noopener"
            >粤ICP备2025009358号-1</a
          ></span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const state = reactive<any>({
  // 列表
  links: [
    {
      name: "react-admin.cn",
      title: "LED 信息库",
      url: "http://react-admin.cn",
    },
  ],
  footerLinks: [
    { label: "使用条款", url: "/" },
    { label: "隐私策略", url: "/" },
    { label: "印记", url: "/" },
    { label: "Cookie 政策", url: "/" },
  ],
  year: new Date().getFullYear(),
});
</script>
