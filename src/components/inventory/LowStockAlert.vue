<template>
  <div class="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900/30">
    <div class="flex items-center">
      <AlertTriangleIcon class="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
      <div class="ml-3">
        <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          The following products are low in stock:
        </p>
        <ul class="mt-2 list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-100">
          <li v-for="product in lowStockProducts" :key="product.id">
            {{ product.name }} ({{ product.stock }} left)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle as AlertTriangleIcon } from 'lucide-vue-next';

const props = defineProps({
  lowStockProducts: Array
});
</script> 