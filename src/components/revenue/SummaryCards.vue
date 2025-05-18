<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800" v-for="card in cards" :key="card.label">
      <div class="flex items-center">
        <div :class="card.bgClass">
          <component :is="card.icon" :class="card.iconClass" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ card.label }}</p>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ card.value }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DollarSign as DollarSignIcon,
  ShoppingCart as ShoppingCartIcon,
  Tag as TagIcon,
  Package as PackageIcon
} from 'lucide-vue-next';

const props = defineProps({
  summaryData: Object,
  formatCurrency: Function
});

const cards = [
  {
    label: 'Total Revenue',
    icon: DollarSignIcon,
    bgClass: 'rounded-md bg-green-100 p-3 dark:bg-green-900',
    iconClass: 'h-6 w-6 text-green-600 dark:text-green-400',
    get value() { return props.formatCurrency(props.summaryData.totalRevenue); }
  },
  {
    label: 'Total Orders',
    icon: ShoppingCartIcon,
    bgClass: 'rounded-md bg-blue-100 p-3 dark:bg-blue-900',
    iconClass: 'h-6 w-6 text-blue-600 dark:text-blue-400',
    get value() { return props.summaryData.totalOrders; }
  },
  {
    label: 'Avg. Order Value',
    icon: TagIcon,
    bgClass: 'rounded-md bg-purple-100 p-3 dark:bg-purple-900',
    iconClass: 'h-6 w-6 text-purple-600 dark:text-purple-400',
    get value() { return props.formatCurrency(props.summaryData.avgOrderValue); }
  },
  {
    label: 'Total Products',
    icon: PackageIcon,
    bgClass: 'rounded-md bg-yellow-100 p-3 dark:bg-yellow-900',
    iconClass: 'h-6 w-6 text-yellow-600 dark:text-yellow-400',
    get value() { return props.summaryData.totalProducts; }
  }
];
</script> 