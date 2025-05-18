<template>
  <div class="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 dark:border-blue-600 dark:bg-blue-900/30">
    <div class="flex items-center">
      <LightbulbIcon class="h-6 w-6 text-blue-500 dark:text-blue-400" />
      <div class="ml-3">
        <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
          Restocking suggestions:
        </p>
        <ul class="mt-2 list-disc pl-5 text-sm text-blue-700 dark:text-blue-100">
          <li v-for="suggestion in restockingSuggestions" :key="suggestion.id">
            {{ suggestion.name }} (Recommended: {{ suggestion.recommendedStock }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Lightbulb as LightbulbIcon } from 'lucide-vue-next';

const props = defineProps({
  restockingSuggestions: Array
});
</script> 