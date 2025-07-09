declare module "#app" {
  interface NuxtApp {
    $api: typeof $fetch;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $api: typeof $fetch;
  }
}

export {};
