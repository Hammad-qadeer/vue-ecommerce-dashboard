<template>
  <aside
    :class="[
      'fixed inset-y-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800 lg:static',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
    class="transition-transform duration-300 ease-in-out"
  >
    <div class="flex h-14 items-center border-b border-gray-200 px-4 dark:border-gray-800">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">E-Commerce Admin</h1>
      <button
        @click="$emit('toggleSidebar')"
        class="ml-auto rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:hidden"
      >
        <XIcon class="h-6 w-6" />
      </button>
    </div>
    <nav class="flex-1 overflow-y-auto p-4">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.page">
          <a
            href="#"
            @click.prevent="$emit('setActivePage', item.page)"
            class="flex items-center rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            :class="item.activeClass"
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
    <!-- User profile section -->
    <div class="border-t border-gray-200 p-4 dark:border-gray-800">
          <div class="flex items-center">
            <img :src="`https://ui-avatars.com/api/?name=${currentUser?.name || 'User'}&background=random`"
              alt="User avatar" class="h-8 w-8 rounded-full" />
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentUser?.name || 'User' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentUser?.email || '' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ currentUser?.role || '' }}</p>
            </div>
            <button @click="handleLogout"
              class="ml-auto rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <LogOutIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import {
  BarChart as BarChartIcon,
  Package as PackageIcon,
  PlusCircle as PlusCircleIcon,
  X as XIcon,
  LogOut as LogOutIcon
} from 'lucide-vue-next';

const props = defineProps({
  isSidebarOpen: Boolean,
  activePage: String,
  currentUser: Object,
  userHasRole: Function
});
const emit = defineEmits(['toggleSidebar', 'setActivePage', 'logout']);

const navItems = computed(() =>
  [
    {
      page: 'revenue',
      label: 'Revenue Analysis',
      icon: BarChartIcon,
      activeClass: props.activePage === 'revenue'
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
        : '',
      visible: props.userHasRole(['admin', 'manager'])
    },
    {
      page: 'inventory',
      label: 'Inventory Management',
      icon: PackageIcon,
      activeClass: props.activePage === 'inventory'
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
        : '',
      visible: true
    },
    {
      page: 'product',
      label: 'Product Registration',
      icon: PlusCircleIcon,
      activeClass: props.activePage === 'product'
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
        : '',
      visible: props.userHasRole(['admin'])
    }
  ].filter(item => item.visible)
);

const handleLogout = () => {
  emit('logout');
};

</script> 