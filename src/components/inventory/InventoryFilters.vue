<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-1 flex-wrap items-center gap-2">
      <div class="relative flex-1 min-w-[200px]">
        <SearchIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Search products..."
          class="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary"
        />
      </div>
      <div class="flex items-center gap-2">
        <select
          :value="categoryFilter"
          @change="$emit('update:categoryFilter', $event.target.value)"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
        <select
          :value="stockFilter"
          @change="$emit('update:stockFilter', $event.target.value)"
          class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary"
        >
          <option value="">All Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="in">In Stock</option>
        </select>
      </div>
    </div>
    <button
      @click="$emit('addProduct')"
      class="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <PlusIcon class="h-4 w-4" />
      Add Product
    </button>
  </div>
</template>

<script setup>
import { Search as SearchIcon, Plus as PlusIcon } from 'lucide-vue-next';
const props = defineProps({
  searchQuery: String,
  categoryFilter: String,
  stockFilter: String,
  categories: Array
});
const emit = defineEmits(['update:searchQuery', 'update:categoryFilter', 'update:stockFilter', 'addProduct']);
</script> 