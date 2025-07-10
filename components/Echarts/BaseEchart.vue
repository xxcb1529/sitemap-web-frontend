<template>
  <div ref="chartRef" :style="{ width, height }" class="echart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import type { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";

interface Props {
  option: EChartsOption;
  theme?: string | null;
  width?: string;
  height?: string;
  autoresize?: boolean;
  loading?: boolean;
  initDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  theme: null,
  width: "100%",
  height: "400px",
  autoresize: true,
  loading: false,
  initDelay: 0,
});

const emit = defineEmits(["chart-initialized"]);

const chartRef = ref<HTMLElement | null>(null); // 图表容器引用
const chartInstance = ref<ECharts | null>(null); // ECharts实例
const initTimer = ref<number>(); // 用于延迟初始化
const resizeObserver = ref<ResizeObserver>(); // 用于监听容器大小变化
const hasInitialized = ref(false); // 用于防止重复初始化
// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: number;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), delay);
  };
};

const validateContainerSize = () => {
  if (!chartRef.value) return false;
  const { clientWidth, clientHeight } = chartRef.value;
  return clientWidth > 0 && clientHeight > 0;
};

const safeInitChart = () => {
  if (!chartRef.value) return;

  // 清理已有实例
  if (chartInstance.value && !chartInstance.value.isDisposed()) {
    chartInstance.value.dispose();
  }

  // 尺寸验证
  if (!validateContainerSize()) {
    console.warn("ECharts container not ready, retrying...");
    initTimer.value = window.setTimeout(safeInitChart, 50);
    return;
  }

  try {
    // 初始化图表
    chartInstance.value = echarts.init(
      chartRef.value,
      props.theme || undefined,
      {
        renderer: "canvas",
        useDirtyRect: true, // 启用脏矩形渲染优化
      }
    );

    // 设置初始选项
    chartInstance.value.setOption(props.option);
    hasInitialized.value = true; // 成功初始化后标记
    // 处理加载状态
    props.loading
      ? chartInstance.value.showLoading("default")
      : chartInstance.value.hideLoading();

    emit("chart-initialized", chartInstance.value);
  } catch (e) {
    console.error("ECharts init error:", e);
  }
};

const resizeChart = debounce(() => {
  if (
    hasInitialized.value &&
    chartInstance.value &&
    !chartInstance.value.isDisposed() &&
    validateContainerSize() &&
    chartRef.value &&
    chartRef.value.offsetWidth > 0
  ) {
    try {
      chartInstance.value.resize({
        silent: true, // 避免触发事件循环
      });
    } catch (e) {
      console.error("ECharts resize error:", e);
    }
  }
}, 100);

// 初始化逻辑
const initialize = () => {
  nextTick(() => {
    // 双 nextTick 确保父级布局完成
    nextTick(() => {
      if (props.initDelay > 0) {
        initTimer.value = window.setTimeout(safeInitChart, props.initDelay);
      } else {
        safeInitChart();
      }
    });
  });
};

onMounted(() => {
  initialize();

  // 响应式父容器监听
  if (props.autoresize && chartRef.value) {
    const checkAndObserve = () => {
      if (validateContainerSize()) {
        resizeObserver.value = new ResizeObserver(resizeChart);
        if (chartRef.value) {
          resizeObserver.value.observe(chartRef.value);
        }
      } else {
        setTimeout(checkAndObserve, 100);
      }
    };
    checkAndObserve();
  }
});

onBeforeUnmount(() => {
  // 清理资源
  clearTimeout(initTimer.value);
  if (chartInstance.value && !chartInstance.value.isDisposed()) {
    chartInstance.value.dispose();
  }
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

// Watch处理
watch(
  () => props.option,
  (newOption) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      // 使用notMerge实现完全更新
      chartInstance.value.setOption(newOption, true);
    }
  },
  { deep: true }
);

watch(
  () => props.loading,
  (isLoading) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      isLoading
        ? chartInstance.value.showLoading("default")
        : chartInstance.value.hideLoading();
    }
  }
);

// 暴露实例方法
defineExpose({
  getInstance: () => chartInstance.value,
  resize: resizeChart,
  dispose: () => chartInstance.value?.dispose(),
});
</script>

<style scoped>
.echart-container {
  position: relative;
  min-width: 100px;
  min-height: 100px;
  transition: height 0.3s ease, width 0.3s ease; /* 添加容器尺寸变化过渡 */
}
</style>
