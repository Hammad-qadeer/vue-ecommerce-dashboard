<template>
  <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
    <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Orders Trend</h3>
    <div v-if="loading" class="h-64 flex items-center justify-center">
      <LoaderIcon class="h-8 w-8 animate-spin text-primary" />
    </div>
    <div v-else class="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <div class="w-full h-full flex flex-col">
        <div class="flex-1 flex items-end">
          <div 
            v-for="(value, index) in ordersData" 
            :key="index" 
            class="flex-1 bg-blue-500 mx-1 rounded-t-md"
            :style="{ height: `${getBarHeight(value, ordersData)}%` }"
          ></div>
        </div>
        <div class="flex justify-between mt-2">
          <span 
            v-for="(label, index) in labels" 
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
  ordersData: Array,
  labels: Array,
  getBarHeight: Function
});
</script> 