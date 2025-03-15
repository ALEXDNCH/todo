<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')

const emit = defineEmits<{
  (e: 'add', text: string): void
}>()

const addTodo = () => {
  if (text.value.trim()) {
    emit('add', text.value.trim())
    text.value = ''
  }
}
</script>

<template>
  <div class="flex gap-2">
    <input 
      v-model="text"
      type="text"
      @keyup.enter="addTodo"
      placeholder="Добавить задачу..."
      class="flex-1 px-4 py-2 border rounded-lg"
    />
    <button 
      @click="addTodo"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg"
    >
      Добавить
    </button>
  </div>
</template>
