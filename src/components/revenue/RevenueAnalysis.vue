<template>
  <div class="space-y-6">
    <SummaryCards :summaryData="summaryData" :formatCurrency="formatCurrency" />

    <ChartControls
      :currentPeriod="currentPeriod"
      :selectedCategory="selectedCategory"
      :categories="categories"
      @changePeriod="changePeriod"
      @update:selectedCategory="updateSelectedCategory"
    />

    <RevenueChart
      :loading="loading.revenue"
      :revenueData="revenueData"
      :formatCurrency="formatCurrency"
      :getBarHeight="getBarHeight"
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <OrdersTrendChart
        :loading="loading.revenue"
        :ordersData="revenueData.ordersData"
        :labels="revenueData.labels"
        :getBarHeight="getBarHeight"
      />
      <InventoryLevelsChart
        :loading="loading.inventory"
        :labels="inventoryData.labels"
        :stockData="inventoryData.stockData"
        :lowStockData="inventoryData.lowStockData"
      />
    </div>
  </div>
</template>

<script setup>
import SummaryCards from './SummaryCards.vue';
import ChartControls from './ChartControls.vue';
import RevenueChart from './RevenueChart.vue';
import OrdersTrendChart from './OrdersTrendChart.vue';
import InventoryLevelsChart from './InventoryLevelsChart.vue';

const props = defineProps({
  summaryData: Object,
  revenueData: Object,
  inventoryData: Object,
  loading: Object,
  currentPeriod: String,
  selectedCategory: String,
  categories: Array,
  formatCurrency: Function,
  getBarHeight: Function
});
const emit = defineEmits(['changePeriod', 'update:selectedCategory']);

const changePeriod = (period) => emit('changePeriod', period);
const updateSelectedCategory = (category) => emit('update:selectedCategory', category);
</script> 