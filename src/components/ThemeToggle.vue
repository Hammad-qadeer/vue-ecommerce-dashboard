<template>
    <button
      @click="toggleDarkMode"
      class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      aria-label="Toggle dark mode"
    >
      <SunIcon v-if="isDarkMode" class="h-5 w-5" />
      <MoonIcon v-else class="h-5 w-5" />
    </button>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-vue-next';
  
  const isDarkMode = ref(false);
  
  // Initialize dark mode based on localStorage or system preference
  onMounted(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      isDarkMode.value = false;
      document.documentElement.classList.remove('dark');
    } else {
      // If no saved preference, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true;
        document.documentElement.classList.add('dark');
      }
    }
  });
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Listen for system preference changes
  onMounted(() => {
    if (window.matchMedia) {
      const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      if (colorSchemeQuery.addEventListener) {
        colorSchemeQuery.addEventListener('change', (e) => {
          // Only apply if user hasn't set a preference
          if (!localStorage.getItem('theme')) {
            isDarkMode.value = e.matches;
            if (isDarkMode.value) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
        });
      }
    }
  });
  </script>
  