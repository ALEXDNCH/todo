<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Todo } from '@/types'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'remove', id: number): void
  (e: 'removeAllTodos'): void
}>()

const removeTodo = () => emit('remove', props.todo.id)
const removeAllTodos = () => emit('removeAllTodos')
const toggleTodo = () => emit('toggle', props.todo.id)
</script>

<template>
  <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
    <input 
      type="checkbox"
      :checked="todo.completed"
      @change="toggleTodo"
      class="w-5 h-5 text-blue-500"
    />
    <div class="flex-1">
      <span :class="{ 'line-through': todo.completed }">
        {{ todo.text }}
      </span>
    </div>
    <button 
      @click="removeTodo"
      class="px-2 py-1 text-red-500"
    >
      Удалить
    </button>
    <button 
      @click="removeAllTodos"
      class="px-2 py-1 text-red-500"
    >
      Удалить все
    </button>
  </div>
</template>
