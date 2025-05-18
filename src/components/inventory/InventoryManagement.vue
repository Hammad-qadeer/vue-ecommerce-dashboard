<template>
  <div class="space-y-6">
    <InventoryFilters
      :searchQuery="searchQuery"
      :categoryFilter="categoryFilter"
      :stockFilter="stockFilter"
      :categories="categories"
      @update:searchQuery="val => $emit('update:searchQuery', val)"
      @update:categoryFilter="val => $emit('update:categoryFilter', val)"
      @update:stockFilter="val => $emit('update:stockFilter', val)"
      @addProduct="() => $emit('addProduct')"
    />

    <InventoryTable
      :products="products"
      :columns="columns"
      :loading="loading.products"
      :sortColumn="sortColumn"
      :sortDirection="sortDirection"
      @sortBy="col => $emit('sortBy', col)"
      @editProduct="product => $emit('editProduct', product)"
      @deleteProduct="product => $emit('deleteProduct', product)"
      @editProductStock="product => $emit('editProductStock', product)"
      @saveProductStock="product => $emit('saveProductStock', product)"
      @cancelEdit="() => $emit('cancelEdit')"
      :editingProduct="editingProduct"
      :getStockStatusClass="getStockStatusClass"
      :formatCurrency="formatCurrency"
    />

    <InventoryPagination
      :pagination="pagination"
      :currentPage="currentPage"
      @prevPage="() => $emit('prevPage')"
      @nextPage="() => $emit('nextPage')"
      @goToPage="page => $emit('goToPage', page)"
      :displayedPages="displayedPages"
      :itemsPerPage="itemsPerPage"
      :total="pagination.total"
    />

    <LowStockAlert v-if="lowStockProducts.length > 0" :lowStockProducts="lowStockProducts" />

    <RestockingSuggestions v-if="restockingSuggestions.length > 0" :restockingSuggestions="restockingSuggestions" />

    <EditProductModal
      v-if="showEditModal"
      :editingProduct="editingProduct"
      :categories="categories"
      @close="() => $emit('closeEditModal')"
      @updateProduct="() => $emit('updateProduct')"
    />

    <AddProductModal
      v-if="showAddProductModal"
      :newProduct="newProduct"
      :categories="categories"
      @close="() => $emit('closeAddProductModal')"
      @addProduct="() => $emit('addProduct')"
    />
  </div>
</template>

<script setup>
import InventoryFilters from './InventoryFilters.vue';
import InventoryTable from './InventoryTable.vue';
import InventoryPagination from './InventoryPagination.vue';
import LowStockAlert from './LowStockAlert.vue';
import RestockingSuggestions from './RestockingSuggestions.vue';
import EditProductModal from './EditProductModal.vue';
import AddProductModal from './AddProductModal.vue';

const props = defineProps({
  searchQuery: String,
  categoryFilter: String,
  stockFilter: String,
  categories: Array,
  products: Array,
  columns: Array,
  loading: Object,
  sortColumn: String,
  sortDirection: String,
  editingProduct: Object,
  getStockStatusClass: Function,
  formatCurrency: Function,
  pagination: Object,
  currentPage: Number,
  displayedPages: Array,
  itemsPerPage: Number,
  lowStockProducts: Array,
  restockingSuggestions: Array,
  showEditModal: Boolean,
  showAddProductModal: Boolean,
  newProduct: Object,
});
const emit = defineEmits([
  'update:searchQuery', 'update:categoryFilter', 'update:stockFilter',
  'addProduct', 'sortBy', 'editProduct', 'deleteProduct', 'editProductStock',
  'saveProductStock', 'cancelEdit', 'prevPage', 'nextPage', 'goToPage',
  'closeEditModal', 'updateProduct', 'closeAddProductModal'
]);
</script> 