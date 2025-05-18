<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="period in periods"
        :key="period"
        @click="$emit('changePeriod', period)"
        class="rounded-md px-3 py-1.5 text-sm font-medium"
        :class="currentPeriod === period 
          ? 'bg-primary text-white dark:bg-primary dark:text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
      >
        {{ period.charAt(0).toUpperCase() + period.slice(1) }}
      </button>
    </div>
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category:</label>
      <select 
        :value="selectedCategory"
        @change="$emit('update:selectedCategory', $event.target.value)"
        class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ 
  currentPeriod: String,
  selectedCategory: String,
  categories: Array
});
const emit = defineEmits(['changePeriod', 'update:selectedCategory']);

const periods = ['daily', 'weekly', 'monthly', 'yearly'];
</script> 