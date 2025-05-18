<template>
  <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
    <div class="flex h-14 items-center px-4">
      <button
        @click="$emit('toggleSidebar')"
        class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:hidden"
      >
        <MenuIcon class="h-6 w-6" />
      </button>
      <div class="ml-4 lg:ml-0">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ pageTitle }}</h2>
      </div>
      <div class="ml-auto flex items-center space-x-4">
        <button
          class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <BellIcon class="h-6 w-6" />
        </button>
        <!-- <button
          @click="$emit('toggleDarkMode')"
          class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <SunIcon v-if="isDarkMode" class="h-6 w-6" />
          <MoonIcon v-else class="h-6 w-6" />
        </button> -->
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup>
import {
  Menu as MenuIcon,
  Bell as BellIcon,
  Sun as SunIcon,
  Moon as MoonIcon
} from 'lucide-vue-next';
import ThemeToggle from './ThemeToggle.vue';

const props = defineProps({
  pageTitle: String,
  isDarkMode: Boolean
});
const emit = defineEmits(['toggleSidebar', 'toggleDarkMode']);
</script> 