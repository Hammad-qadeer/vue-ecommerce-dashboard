<template>
  <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
    <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Revenue Trends</h3>
    <div v-if="loading" class="h-80 flex items-center justify-center">
      <LoaderIcon class="h-8 w-8 animate-spin text-primary" />
    </div>
    <div v-else class="h-80 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <div class="w-full h-full flex flex-col">
        <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <div v-for="(value, index) in revenueData.revenueData" :key="index" class="flex justify-between mb-1">
            <span>{{ revenueData.labels[index] }}:</span>
            <span>{{ formatCurrency(value) }} ({{ revenueData.ordersData[index] }} orders)</span>
          </div>
        </div>
        <div class="flex-1 flex items-end">
          <div 
            v-for="(value, index) in revenueData.revenueData" 
            :key="index" 
            class="flex-1 bg-primary mx-1 rounded-t-md"
            :style="{ height: `${getBarHeight(value, revenueData.revenueData)}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-2">
          <span 
            v-for="(label, index) in revenueData.labels" 
            :key="index"
            class="text-xs text-gray-500 dark:text-gray-400 flex-1 text-center"
          >
            {{ label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loader as LoaderIcon } from 'lucide-vue-next';

const props = defineProps({
  loading: Boolean,
  revenueData: Object,
  formatCurrency: Function,
  getBarHeight: Function
});
</script> 