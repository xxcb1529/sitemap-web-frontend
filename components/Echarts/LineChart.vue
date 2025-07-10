<template>
  <div ref="chartRef" class="w-full h-96"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref, onBeforeUnmount } from "vue";

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const chartOptions: echarts.EChartsOption = {
  title: {
    text: "折线图示例",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "销量",
      type: "line",
      data: [120, 200, 150, 80, 70, 110, 130],
      smooth: true,
    },
  ],
};

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(chartOptions);

    // 响应式自适应
    window.addEventListener("resize", resizeChart);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart);
  chartInstance?.dispose();
});

function resizeChart() {
  chartInstance?.resize();
}
</script>

<style scoped>
/* 防止容器高度为 0 */
div {
  min-height: 300px;
}
</style>
