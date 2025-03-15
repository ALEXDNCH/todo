<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', date: Date): void
  (e: 'close'): void
}>()

const selectedDate = ref(new Date())

function handleSubmit() {
  emit('submit', selectedDate.value)
  emit('close')
}
</script>

<template>
  <div>
    <slot name="title">
      Добавить новый день
    </slot>

    <div class="mb-4">
      <input 
        type="date" 
        v-model="selectedDate" 
        class="w-full p-2 border rounded"
      />
    </div>

    <div class="flex justify-end gap-2">
      <button 
        @click="emit('close')"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Отмена
      </button>
      <button 
        @click="handleSubmit"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Добавить
      </button>
    </div>
  </div>
</template>
