import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

export function useChart(chartRef: any, options: any) {
  const chart = ref<echarts.ECharts | null>(null);

  const initChart = () => {
    if (chartRef.value) {
      chart.value = echarts.init(chartRef.value);
      chart.value.setOption(options);
    }
  };

  const updateChart = (newOptions: any) => {
    if (chart.value) {
      chart.value.setOption(newOptions);
    }
  };

  const resizeChart = () => {
    if (chart.value) {
      chart.value.resize();
    }
  };

  const disposeChart = () => {
    if (chart.value) {
      chart.value.dispose();
      chart.value = null;
    }
  };

  onMounted(() => {
    initChart();
    window.addEventListener('resize', resizeChart);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resizeChart);
    disposeChart();
  });

  watch(
    () => options,
    (newOptions) => {
      updateChart(newOptions);
    },
    { deep: true }
  );

  return {
    chart: chart.value,
    updateChart,
    resizeChart,
    disposeChart
  };
}
