<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TodoList from './components/TodoList.vue'
import TodoForm from './components/TodoForm.vue'
import DaySelector from './components/DaySelector.vue'
import type { Todo, Day } from './types'

// Загрузка данных из localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : defaultValue
}

// Состояние
const todos = ref<Record<number, Todo[]>>(loadFromStorage('todos', {}))
const days = ref<Day[]>(loadFromStorage('days', [
  { 
    id: Date.now(),
    name: new Date().toISOString(),
    date: new Date().toISOString()
  }
]))
const currentDay = ref<number>(loadFromStorage('currentDay', days.value[0]?.id || 0))

// Сохранение в localStorage
watch([todos, days, currentDay], () => {
  localStorage.setItem('todos', JSON.stringify(todos.value))
  localStorage.setItem('days', JSON.stringify(days.value))
  localStorage.setItem('currentDay', JSON.stringify(currentDay.value))
}, { deep: true })

// Вычисляемые свойства
const currentTodos = computed(() => todos.value[currentDay.value] || [])
const hasCompletedTodos = computed(() => currentTodos.value.some(todo => todo.completed))

// Сортировка дней по дате
const sortedDays = computed(() => {
  return [...days.value].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB
  })
})

// Управление задачами
const addTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false
  }
  
  if (!todos.value[currentDay.value]) {
    todos.value[currentDay.value] = []
  }
  todos.value[currentDay.value] = [...todos.value[currentDay.value], newTodo]
}

const toggleTodo = (id: number) => {
  console.log('id', id)
  const todoList = todos.value[currentDay.value]
  if (!todoList) return

  todos.value[currentDay.value] = todoList.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  )
}

const removeTodo = (id: number) => {
  const todoList = todos.value[currentDay.value]
  if (!todoList) return

  todos.value[currentDay.value] = todoList.filter(todo => todo.id !== id)
}

const removeCompletedTodos = () => {
  const todoList = todos.value[currentDay.value]
  if (!todoList) return

  todos.value[currentDay.value] = todoList.filter(todo => !todo.completed)
}

// Управление днями
const addDay = (name: string, date: Date) => {
  const newDay: Day = {
    id: Date.now(),
    name,
    date: date.toISOString()
  }
  days.value.push(newDay)
  currentDay.value = newDay.id
  todos.value[newDay.id] = []
}

const removeDay = (id: number) => {
  days.value = days.value.filter(day => day.id !== id)
  delete todos.value[id]
  
  if (currentDay.value === id) {
    currentDay.value = days.value[0].id
  }
}

const deleteAllTasks = () => {
  console.log('currentDay.value', currentDay.value)
  todos.value[currentDay.value] = []
}

// Автоматическое создание дня при запуске, если нет дней
onMounted(() => {
  if (days.value.length === 0) {
    const today = new Date()
    const newDay: Day = {
      id: Date.now(),
      name: today.toISOString(),
      date: today.toISOString()
    }
    days.value.push(newDay)
    currentDay.value = newDay.id
    todos.value[newDay.id] = []
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <ModalContainer />
    <h1 class="text-3xl font-bold mb-8 text-center">Список задач</h1>

    <!-- Селектор дней -->
    <DaySelector
      :days="sortedDays"
      :current-day="currentDay"
      @day-selected="(id: number) => currentDay = id"
      @day-added="addDay"
      @day-removed="removeDay"
    />

    <!-- Форма добавления задачи -->
    <TodoForm @add="addTodo" />


    <!-- Список задач -->
    <TodoList
      :todos="currentTodos"
      @toggle="(id: number) => toggleTodo(id)"
      @remove="(id: number) => removeTodo(id)"
      @removeAllTodos="deleteAllTasks"
    />

    <!-- Кнопка удаления завершенных задач -->
    <div 
      v-if="hasCompletedTodos"
      class="text-center text-gray-500 mt-8"
    >
      <button
        @click="removeCompletedTodos"
        class="text-red-500 hover:text-red-600"
      >
        Удалить завершенные задачи
      </button>
    </div>

    <!-- Сообщение об отсутствии задач -->
    <div
      v-if="currentTodos.length === 0"
      class="text-center text-gray-500 mt-8"
    >
      Нет задач
    </div>
  </div>
</template>
