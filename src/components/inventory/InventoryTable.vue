<template>
  <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="column.sortable && $emit('sortBy', column.key)"
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              :class="{ 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600': column.sortable }"
            >
              <div class="flex items-center">
                {{ column.label }}
                <span v-if="column.sortable" class="ml-1">
                  <ChevronUpIcon
                    v-if="sortColumn === column.key && sortDirection === 'asc'"
                    class="h-4 w-4"
                  />
                  <ChevronDownIcon
                    v-else-if="sortColumn === column.key && sortDirection === 'desc'"
                    class="h-4 w-4"
                  />
                  <!-- <ChevronUpDownIcon v-else class="h-4 w-4 text-gray-400" /> -->
                </span>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr v-if="loading">
            <td :colspan="columns.length + 1" class="px-6 py-4 text-center">
              <LoaderIcon class="h-8 w-8 animate-spin text-primary mx-auto" />
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No products found.
            </td>
          </tr>
          <tr
            v-for="product in products"
            :key="product.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="whitespace-nowrap px-6 py-4">
              <div class="flex items-center">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="h-10 w-10 rounded-md object-cover"
                />
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ product.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ product.brand }}
                  </div>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ product.category }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
              {{ formatCurrency(product.price) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <div v-if="editingProduct && editingProduct.id === product.id" class="flex items-center">
                <input
                  v-model="editingProduct.stock"
                  type="number"
                  min="0"
                  class="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  @click="$emit('saveProductStock', product)"
                  class="ml-2 rounded-md bg-green-500 p-1 text-white hover:bg-green-600"
                >
                  <CheckIcon class="h-4 w-4" />
                </button>
                <button
                  @click="$emit('cancelEdit')"
                  class="ml-1 rounded-md bg-gray-500 p-1 text-white hover:bg-gray-600"
                >
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
              <div v-else class="flex items-center">
                <span
                  class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                  :class="getStockStatusClass(product.stock)"
                >
                  {{ product.stock }}
                </span>
                <button
                  @click="$emit('editProductStock', product)"
                  class="ml-2 rounded-md bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <EditIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
              <button
                @click="$emit('editProduct', product)"
                class="mr-2 rounded-md bg-blue-100 p-1 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
              >
                <Edit2Icon class="h-4 w-4" />
              </button>
              <button
                @click="$emit('deleteProduct', product)"
                class="rounded-md bg-red-100 p-1 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800"
              >
                <Trash2Icon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
//   ChevronUpDown as ChevronUpDownIcon,
  Edit as EditIcon,
  Edit2 as Edit2Icon,
  Trash2 as Trash2Icon,
  Check as CheckIcon,
  X as XIcon,
  Loader as LoaderIcon
} from 'lucide-vue-next';

const props = defineProps({
  products: Array,
  columns: Array,
  loading: Boolean,
  sortColumn: String,
  sortDirection: String,
  editingProduct: Object,
  getStockStatusClass: Function,
  formatCurrency: Function
});
const emit = defineEmits([
  'sortBy', 'editProduct', 'deleteProduct', 'editProductStock', 'saveProductStock', 'cancelEdit'
]);
</script> 