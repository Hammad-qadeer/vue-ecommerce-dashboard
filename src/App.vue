<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <LoginForm v-if="!isLoggedIn" @login-success="handleLoginSuccess" />
    <div v-else class="flex h-screen overflow-hidden">
      <SidebarNavigation
        :isSidebarOpen="isSidebarOpen"
        :activePage="activePage"
        :currentUser="currentUser"
        :userHasRole="userHasRole"
        @toggleSidebar="toggleSidebar"
        @setActivePage="setActivePage"
        @logout="handleLogout"
      />
      <div class="flex flex-1 flex-col overflow-hidden">
        <TopNavigation
          :pageTitle="pageTitle"
          :isDarkMode="isDarkMode"
          @toggleSidebar="toggleSidebar"
          @toggleDarkMode="toggleDarkMode"
        />
        <main class="flex-1 overflow-y-auto p-4">
          <RevenueAnalysis
            v-if="activePage === 'revenue' && userHasRole(['admin', 'manager'])"
            :summaryData="summaryData"
            :revenueData="revenueData"
            :inventoryData="inventoryData"
            :loading="loading"
            :currentPeriod="currentPeriod"
            :selectedCategory="selectedCategory"
            :categories="categories"
            :formatCurrency="formatCurrency"
            :getBarHeight="getBarHeight"
            @changePeriod="changePeriod"
            @update:selectedCategory="val => selectedCategory = val"
          />
          <InventoryManagement
            v-if="activePage === 'inventory'"
            :searchQuery="searchQuery"
            :categoryFilter="categoryFilter"
            :stockFilter="stockFilter"
            :categories="categories"
            :products="products"
            :columns="columns"
            :loading="loading"
            :sortColumn="sortColumn"
            :sortDirection="sortDirection"
            :editingProduct="editingProduct"
            :getStockStatusClass="getStockStatusClass"
            :formatCurrency="formatCurrency"
            :pagination="pagination"
            :currentPage="currentPage"
            :displayedPages="displayedPages"
            :itemsPerPage="itemsPerPage"
            :lowStockProducts="lowStockProducts"
            :restockingSuggestions="restockingSuggestions"
            :showEditModal="showEditModal"
            :showAddProductModal="showAddProductModal"
            :newProduct="newProduct"
            :userHasRole="userHasRole"
            @update:searchQuery="val => searchQuery = val"
            @update:categoryFilter="val => categoryFilter = val"
            @update:stockFilter="val => stockFilter = val"
            @addProduct="showAddProductModal = true"
            @sortBy="sortBy"
            @editProduct="editProduct"
            @deleteProduct="deleteProduct"
            @editProductStock="editProductStock"
            @saveProductStock="saveProductStock"
            @cancelEdit="cancelEdit"
            @prevPage="prevPage"
            @nextPage="nextPage"
            @goToPage="goToPage"
            @closeEditModal="showEditModal = false"
            @updateProduct="updateProduct"
            @closeAddProductModal="showAddProductModal = false"
          />
          <div v-if="activePage === 'product' && userHasRole(['admin'])" class="space-y-6">
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Register New Product</h3>
              <form @submit.prevent="submitForm" class="space-y-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      v-model="form.name"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category <span class="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      v-model="form.category"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="" disabled>Select a category</option>
                      <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                      <option value="new">+ Add New Category</option>
                    </select>
                    <div v-if="form.category === 'new'" class="mt-2">
                      <input
                        v-model="newCategory"
                        type="text"
                        placeholder="Enter new category name"
                        class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <p v-if="errors.category" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.category }}</p>
                  </div>
                  <div>
                    <label for="brand" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Brand <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="brand"
                      v-model="form.brand"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p v-if="errors.brand" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.brand }}</p>
                  </div>
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price ($) <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="price"
                      v-model="form.price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p v-if="errors.price" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.price }}</p>
                  </div>
                  <div>
                    <label for="stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Initial Stock <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="stock"
                      v-model="form.stock"
                      type="number"
                      min="0"
                      required
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p v-if="errors.stock" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.stock }}</p>
                  </div>
                  <div>
                    <label for="sku" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SKU
                    </label>
                    <input
                      id="sku"
                      v-model="form.sku"
                      type="text"
                      class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Image
                  </label>
                  <div class="mt-1 flex items-center space-x-4">
                    <div class="h-32 w-32 overflow-hidden rounded-md border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                      <img
                        v-if="imagePreview"
                        :src="imagePreview"
                        alt="Product preview"
                        class="h-full w-full object-cover"
                      />
                      <div v-else class="flex h-full items-center justify-center text-gray-400">
                        <ImageIcon class="h-12 w-12" />
                      </div>
                    </div>
                    <div class="flex flex-col space-y-2">
                      <input
                        type="text"
                        v-model="form.imageUrl"
                        placeholder="Enter image URL"
                        class="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Or leave empty to use a placeholder image
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="resetForm"
                    class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Register Product
                  </button>
                </div>
              </form>
            </div>
            <div
              v-if="showSuccess"
              class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20"
            >
              <div class="flex">
                <CheckCircleIcon class="h-5 w-5 text-green-400" />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800 dark:text-green-400">Product Registered Successfully</h3>
                  <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>{{ successMessage }}</p>
                  </div>
                  <div class="mt-4">
                    <div class="-mx-2 -my-1.5 flex">
                      <button
                        @click="viewProduct"
                        class="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                      >
                        View in Inventory
                      </button>
                      <button
                        @click="showSuccess = false"
                        class="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="recentProducts.length > 0" class="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
              <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Recently Added Products</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Product
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Category
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Price
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Stock
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        Added
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    <tr v-for="product in recentProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {{ product.stock }}
                      </td>
                      <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(product.createdAt) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  BarChart as BarChartIcon, 
  Package as PackageIcon, 
  PlusCircle as PlusCircleIcon,
  Menu as MenuIcon,
  X as XIcon,
  Bell as BellIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  DollarSign as DollarSignIcon,
  ShoppingCart as ShoppingCartIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Edit as EditIcon,
  Edit2 as Edit2Icon,
  Trash2 as Trash2Icon,
  Check as CheckIcon,
  AlertTriangle as AlertTriangleIcon,
  Lightbulb as LightbulbIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
  Loader as LoaderIcon
} from 'lucide-vue-next';
import SidebarNavigation from './components/SidebarNavigation.vue';
import TopNavigation from './components/TopNavigation.vue';
import RevenueAnalysis from './components/revenue/RevenueAnalysis.vue';
import InventoryManagement from './components/inventory/InventoryManagement.vue';
import LoginForm from './components/auth/LoginForm.vue';
import { isAuthenticated, getCurrentUser, logout, hasRole, authenticatedFetch } from './services/auth-service.js';

const API_URL = import.meta.env.VITE_API_URL;

const isSidebarOpen = ref(false);
const isDarkMode = ref(false);
const activePage = ref('revenue');
const loading = ref({
  products: false,
  categories: false,
  revenue: false,
  inventory: false,
  lowStock: false,
  restocking: false
});

const currentPeriod = ref('monthly');
const selectedCategory = ref('');
const summaryData = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  avgOrderValue: 0
});
const revenueData = ref({
  labels: [],
  revenueData: [],
  ordersData: []
});
const inventoryData = ref({
  labels: [],
  stockData: [],
  lowStockData: []
});

const searchQuery = ref('');
const categoryFilter = ref('');
const stockFilter = ref('');
const sortColumn = ref('name');
const sortDirection = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const products = ref([]);
const categories = ref([]);
const lowStockProducts = ref([]);
const restockingSuggestions = ref([]);
const pagination = ref({
  total: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 10
});
const showEditModal = ref(false);
const showAddProductModal = ref(false);
const editingProduct = ref(null);
const newProduct = ref({
  name: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  description: '',
  image: ''
});

const form = ref({
  name: '',
  category: '',
  brand: '',
  price: '',
  stock: '',
  sku: '',
  description: '',
  imageUrl: ''
});
const newCategory = ref('');
const errors = ref({});
const showSuccess = ref(false);
const successMessage = ref('');
const recentProducts = ref([]);

const columns = [
  { key: 'name', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true }
];

const pageTitle = computed(() => {
  switch (activePage.value) {
    case 'revenue':
      return 'Revenue Analysis';
    case 'inventory':
      return 'Inventory Management';
    case 'product':
      return 'Product Registration';
    default:
      return 'Dashboard';
  }
});

const imagePreview = computed(() => {
  return form.value.imageUrl || null;
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  
  if (pagination.value.totalPages <= maxPagesToShow) {
    for (let i = 1; i <= pagination.value.totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    let start = Math.max(2, currentPage.value - 1);
    let end = Math.min(pagination.value.totalPages - 1, start + 2);
    if (end === pagination.value.totalPages - 1) {
      start = Math.max(2, end - 2);
    }
    if (start > 2) {
      pages.push('...');
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < pagination.value.totalPages - 1) {
      pages.push('...');
    }
    pages.push(pagination.value.totalPages);
  }
  
  return pages;
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
};

const setActivePage = (page) => {
  activePage.value = page;
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
  
  if (page === 'revenue') {
    fetchSummaryData();
    fetchRevenueData();
    fetchInventoryData();
  } else if (page === 'inventory') {
    fetchProducts();
    fetchLowStockProducts();
    fetchRestockingSuggestions();
  } else if (page === 'product') {
    fetchRecentProducts();
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStockStatusClass = (stock) => {
  if (stock === 0) {
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  } else if (stock <= 20) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  } else {
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  }
};

const getBarHeight = (value, dataArray) => {
  const max = Math.max(...dataArray);
  return max > 0 ? (value / max) * 80 : 0;
};

const changePeriod = (period) => {
  currentPeriod.value = period;
  fetchRevenueData();
};

const fetchSummaryData = async () => {
  try {
    loading.value.summary = true;
    const url = new URL(`${API_URL}/analytics/summary`);
    if (selectedCategory.value) {
      url.searchParams.append('category', selectedCategory.value);
    }
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    summaryData.value = data;
  } catch (error) {
    console.error('Error fetching summary data:', error);
  } finally {
    loading.value.summary = false;
  }
};

const fetchRevenueData = async () => {
  try {
    loading.value.revenue = true;
    const url = new URL(`${API_URL}/analytics/revenue`);
    url.searchParams.append('period', currentPeriod.value);
    if (selectedCategory.value) {
      url.searchParams.append('category', selectedCategory.value);
    }
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    revenueData.value = data;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
  } finally {
    loading.value.revenue = false;
  }
};

const fetchInventoryData = async () => {
  try {
    loading.value.inventory = true;
    const response = await authenticatedFetch(`${API_URL}/analytics/inventory`);
    const data = await response.json();
    inventoryData.value = data;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
  } finally {
    loading.value.inventory = false;
  }
};

const fetchProducts = async () => {
  try {
    loading.value.products = true;
    const url = new URL(`${API_URL}/products`);
    url.searchParams.append('page', currentPage.value);
    url.searchParams.append('limit', itemsPerPage.value);
    
    if (searchQuery.value) {
      url.searchParams.append('search', searchQuery.value);
    }
    if (categoryFilter.value) {
      url.searchParams.append('category', categoryFilter.value);
    }
    if (stockFilter.value) {
      url.searchParams.append('stock', stockFilter.value);
    }
    
    const response = await authenticatedFetch(url);
    const data = await response.json();
    products.value = data.products;
    pagination.value = data.pagination;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value.products = false;
  }
};

const fetchCategories = async () => {
  try {
    const res = await authenticatedFetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    categories.value = await res.json();
  } catch (err) {
    categories.value = [];
    console.error('Error fetching categories:', err);
  }
};

const fetchLowStockProducts = async () => {
  try {
    const res = await authenticatedFetch(`${API_URL}/products/low-stock`);
    if (!res.ok) throw new Error('Failed to fetch low stock products');
    lowStockProducts.value = await res.json();
  } catch (err) {
    lowStockProducts.value = [];
    console.error('Error fetching low stock products:', err);
  }
};

const fetchRestockingSuggestions = async () => {
  try {
    const res = await authenticatedFetch(`${API_URL}/products/restocking-suggestions`);
    if (!res.ok) throw new Error('Failed to fetch restocking suggestions');
    restockingSuggestions.value = await res.json();
  } catch (err) {
    restockingSuggestions.value = [];
    console.error('Error fetching restocking suggestions:', err);
  }
};

const sortBy = (column) => {
  if (column === sortColumn.value) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
  fetchProducts();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProducts();
  }
};

const nextPage = () => {
  if (currentPage.value < pagination.value.totalPages) {
    currentPage.value++;
    fetchProducts();
  }
};

const goToPage = (page) => {
  if (typeof page === 'number') {
    currentPage.value = page;
    fetchProducts();
  }
};

const editProductStock = (product) => {
  editingProduct.value = { ...product };
};

const saveProductStock = async (product) => {
  try {
    const response = await authenticatedFetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ stock: parseInt(editingProduct.value.stock) })
    });
    
    if (response.ok) {
      const updatedProduct = await response.json();
      const index = products.value.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }
      editingProduct.value = null;
      
      // Refresh low stock products
      fetchLowStockProducts();
      fetchRestockingSuggestions();
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
  }
};

const cancelEdit = () => {
  editingProduct.value = null;
};

const editProduct = (product) => {
  editingProduct.value = { ...product };
  showEditModal.value = true;
};

const updateProduct = async (product) => {
  try {
    const res = await authenticatedFetch(`${API_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    // Optionally refresh products
    fetchProducts();
  } catch (err) {
    console.error('Error updating product:', err);
  }
};

const deleteProduct = async (product) => {
  if (confirm(`Are you sure you want to delete ${product.name}?`)) {
    try {
      const res = await authenticatedFetch(`${API_URL}/products/${product.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete product');
        fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  }
};

const addProduct = async () => {
  // Validate form
  if (!newProduct.value.name || !newProduct.value.category || !newProduct.value.brand) {
    alert('Please fill in all required fields');
    return;
  }
  
  try {
    const response = await authenticatedFetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct.value)
    });
    
    if (response.ok) {
      const product = await response.json();
      
      // Add to products array if we're on the first page
      if (currentPage.value === 1) {
        products.value.unshift(product);
        if (products.value.length > itemsPerPage.value) {
          products.value.pop();
        }
      }
      
      // Reset form and close modal
      newProduct.value = {
        name: '',
        category: '',
        brand: '',
        price: 0,
        stock: 0,
        description: '',
        image: ''
      };
      showAddProductModal.value = false;
      
      // Refresh related data
      fetchProducts();
      fetchLowStockProducts();
      fetchRestockingSuggestions();
    }
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

// Product Registration Methods
const fetchRecentProducts = async () => {
  try {
    const response = await authenticatedFetch(`${API_URL}/products?page=1&limit=5`);
    const data = await response.json();
    recentProducts.value = data.products;
  } catch (error) {
    console.error('Error fetching recent products:', error);
  }
};

const validateForm = () => {
  const newErrors = {};
  
  if (!form.value.name.trim()) {
    newErrors.name = 'Product name is required';
  }
  
  if (!form.value.category) {
    newErrors.category = 'Category is required';
  } else if (form.value.category === 'new' && !newCategory.value.trim()) {
    newErrors.category = 'New category name is required';
  }
  
  if (!form.value.brand.trim()) {
    newErrors.brand = 'Brand is required';
  }
  
  if (!form.value.price) {
    newErrors.price = 'Price is required';
  } else if (parseFloat(form.value.price) < 0) {
    newErrors.price = 'Price cannot be negative';
  }
  
  if (!form.value.stock) {
    newErrors.stock = 'Initial stock is required';
  } else if (parseInt(form.value.stock) < 0) {
    newErrors.stock = 'Stock cannot be negative';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }
  
  // Determine the category
  const productCategory = form.value.category === 'new' ? newCategory.value : form.value.category;
  
  try {
    const productData = {
      name: form.value.name,
      category: productCategory,
      brand: form.value.brand,
      price: parseFloat(form.value.price),
      stock: parseInt(form.value.stock),
      sku: form.value.sku || `SKU-${Date.now()}`,
      description: form.value.description || `Description for ${form.value.name}`,
      image: form.value.imageUrl || `https://picsum.photos/seed/${Date.now()}/200/200`
    };
    
    const response = await authenticatedFetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      const newProduct = await response.json();
      
      // Show success message
      successMessage.value = `Product "${newProduct.name}" has been successfully registered.`;
      showSuccess.value = true;
      
      // Reset form
      resetForm();
      
      // Refresh recent products
      fetchRecentProducts();
    }
  } catch (error) {
    console.error('Error registering product:', error);
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    sku: '',
    description: '',
    imageUrl: ''
  };
  newCategory.value = '';
  errors.value = {};
};

const viewProduct = () => {
  setActivePage('inventory');
};

// Watch for changes in filters
watch([searchQuery, categoryFilter, stockFilter], () => {
  currentPage.value = 1;
  fetchProducts();
});

watch([selectedCategory], () => {
  fetchSummaryData();
  fetchRevenueData();
});

// Watch for changes in imageUrl to validate
watch(() => form.value.imageUrl, (newUrl) => {
  if (newUrl) {
    const img = new Image();
    img.onerror = () => {
      // Invalid image URL
      form.value.imageUrl = '';
    };
    img.src = newUrl;
  }
});

// Lifecycle hooks
onMounted(() => {
  const darkPref = localStorage.getItem('darkMode');
  if (darkPref === 'true' || (darkPref === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
  
  // Fetch initial data
  fetchCategories();
  setActivePage('revenue');
});

// Authentication state
const isLoggedIn = ref(false);
const currentUser = ref(null);

onMounted(() => {
  const darkPref = localStorage.getItem('darkMode');
  if (darkPref === 'true' || (darkPref === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }

  isLoggedIn.value = isAuthenticated();
  if (isLoggedIn.value) {
    currentUser.value = getCurrentUser();
    setActivePage('revenue');
  }
});

const handleLoginSuccess = (user) => {
  isLoggedIn.value = true;
  currentUser.value = user;
  //fetchCategories();
  setActivePage('revenue');
};

const handleLogout = () => {
  logout();
  isLoggedIn.value = false;
  currentUser.value = null;
  activePage.value = 'login';
};

const userHasRole = (roles) => {
  return hasRole(roles);
};

console.log(currentUser.value, 'currentUser', userHasRole(['admin']))
</script>