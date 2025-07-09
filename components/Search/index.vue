<template>
  <el-form
    ref="formRef"
    :model="modelForm"
    :rules="rules"
    class="app-nav-search"
    @submit.native.prevent
  >
    <el-form-item prop="title">
      <el-input
        v-model="modelForm.title"
        class="w-60"
        clearable
        placeholder="请输入关键字搜索"
        type="text"
        @keyup.enter.native="onInputSearch"
      />
      <el-button @click="onSearch">
        <Icon name="ep:search" />
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { debounce } from "lodash-es";

const modelForm = reactive({ title: "" });
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入关键字搜索", trigger: "blur" }],
});
const emit = defineEmits(["handleSearch"]);

const onEmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return;

    emit("handleSearch", modelForm);
  });
};

const onSearch = debounce(() => {
  onEmit();
}, 500);

// 搜索
const onInputSearch = () => {
  onEmit();
};
</script>
