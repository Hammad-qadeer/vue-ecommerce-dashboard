<template>
  <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
    <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Inventory Levels</h3>
    <div v-if="loading" class="h-64 flex items-center justify-center">
      <LoaderIcon class="h-8 w-8 animate-spin text-primary" />
    </div>
    <div v-else class="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <div class="w-full h-full p-4">
        <div v-for="(label, index) in labels" :key="index" class="mb-2">
          <div class="flex justify-between mb-1">
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ stockData[index] }} items ({{ lowStockData[index] }} low)
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div 
              class="bg-purple-600 h-2.5 rounded-full" 
              :style="{ width: `${(stockData[index] / Math.max(...stockData)) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loader as LoaderIcon } from 'lucide-vue-next';

const props = defineProps({
  loading: Boolean,
  labels: Array,
  stockData: Array,
  lowStockData: Array
});
</script> 