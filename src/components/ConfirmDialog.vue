<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// Обработка нажатия клавиши Enter
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && props.show) {
    emit('confirm')
  } else if (e.key === 'Escape' && props.show) {
    emit('cancel')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
        <!-- Заголовок -->
        <div class="bg-gray-50 px-6 py-4 border-b">
          <h3 class="text-lg font-medium text-gray-900">
            {{ title }}
          </h3>
        </div>

        <!-- Сообщение -->
        <div class="px-6 py-4">
          <p class="text-gray-700">
            {{ message }}
          </p>
        </div>

        <!-- Кнопки -->
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            @click="emit('cancel')"
            class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Отмена
          </button>
          <button
            @click="emit('confirm')"
            type="submit"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
