<template>
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
            <option value="">Select category</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
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
        </div>
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price <span class="text-red-500">*</span>
          </label>
          <input
            id="price"
            v-model.number="form.price"
            type="number"
            min="0"
            step="0.01"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stock <span class="text-red-500">*</span>
          </label>
          <input
            id="stock"
            v-model.number="form.stock"
            type="number"
            min="0"
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <!-- <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image URL
          </label>
          <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="text"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div> -->
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
      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="resetForm"
          class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          {{ submitting ? 'Registering...' : 'Register Product' }}
        </button>
      </div>
      <div v-if="successMessage" class="mt-4 rounded bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900 dark:text-green-200">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mt-4 rounded bg-red-100 px-4 py-2 text-red-800 dark:bg-red-900 dark:text-red-200">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { authenticatedFetch } from '@/services/auth-service.js';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  apiUrl: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['product-registered']);

const form = ref({
  name: '',
  category: '',
  brand: '',
  price: '',
  stock: '',
  imageUrl: ''
});
const submitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

function resetForm() {
  form.value = {
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    imageUrl: ''
  };
  successMessage.value = '';
  errorMessage.value = '';
}

// Fetch recent products (last 5, most recent first)
async function fetchRecentProducts() {
  try {
    const res = await authenticatedFetch(`${props.apiUrl}/products?_sort=createdAt&_order=desc&_limit=5`);
    if (!res.ok) throw new Error('Failed to fetch recent products');
    recentProducts.value = await res.json();
  } catch (err) {
    recentProducts.value = [];
    console.error('Error fetching recent products:', err);
  }
}

async function submitForm() {
  submitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  try {
    const productData = {
      name: form.value.name,
      category: form.value.category,
      brand: form.value.brand,
      price: parseFloat(form.value.price),
      stock: parseInt(form.value.stock),
      image: form.value.imageUrl,
      createdAt: new Date().toISOString()
    };
    const response = await authenticatedFetch(`${props.apiUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to register product');
    const newProduct = await response.json();
    successMessage.value = `Product "${newProduct.name}" has been successfully registered.`;
    emit('product-registered', newProduct);
    resetForm();
    fetchRecentProducts();
    setTimeout(() => (successMessage.value = ''), 4000);
  } catch (err) {
    errorMessage.value = err.message || 'An error occurred';
  } finally {
    submitting.value = false;
  }
}
</script> 