<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { Todo } from '@/types'

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'remove', id: number): void
  (e: 'removeAllTodos'): void
}>()
</script>

<template>
  <div class="mt-6 space-y-2">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="(id: number) => emit('toggle', id)"
      @remove="(id: number) => emit('remove', id)"
      @removeAllTodos="emit('removeAllTodos')"
    />
    
  </div>
</template>
