<script setup lang="ts">
import { ref } from 'vue'
import type { Day } from '@/types'
import { useFormatDate } from '@/composables/formatDate'
import { useModal } from '@/composables/useModal'
import ModalDialog from './ModalDialog.vue'

const props = defineProps<{
  days: Day[]
  currentDay: number
}>()

const emit = defineEmits<{
  (e: 'day-selected', id: number): void
  (e: 'day-added', name: string, date: Date): void
  (e: 'day-removed', id: number): void
}>()

const { formatDate } = useFormatDate()
const { isOpen: isAddOpen, show: showAdd, hide: hideAdd } = useModal()
const { isOpen: isConfirmOpen, show: showConfirm, hide: hideConfirm } = useModal()
const selectedDate = ref(new Date().toISOString().split('T')[0])
const dayToRemove = ref<number | null>(null)

const addNewDay = () => {
  selectedDate.value = new Date().toISOString().split('T')[0]
  showAdd()
}

const handleSubmit = () => {
  const date = new Date(selectedDate.value)
  const formattedDate = formatDate(date.toISOString())
  emit('day-added', formattedDate, date)
  hideAdd()
}

const initiateRemoveDay = (dayId: number) => {
  dayToRemove.value = dayId
  showConfirm()
}

const confirmRemoveDay = () => {
  if (dayToRemove.value !== null) {
    emit('day-removed', dayToRemove.value)
    hideConfirm()
  }
}
</script>

<template>
  <div>
    <!-- Модальное окно для добавления дня -->
    <ModalDialog 
      :show="isAddOpen"
      @close="hideAdd"
      title="Добавить новый день"
    >
      <div class="mb-4">
        <input 
          type="date" 
          v-model="selectedDate" 
          class="w-full p-2 border rounded"
        />
      </div>
      
      <template #footer>
        <button 
          @click="hideAdd"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
        <button 
          @click="handleSubmit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
        >
          Добавить
        </button>
      </template>
    </ModalDialog>

    <!-- Модальное окно для подтверждения удаления -->
    <ModalDialog
      :show="isConfirmOpen"
      @close="hideConfirm"
      title="Подтверждение"
    >
      <p class="text-gray-700">
        Вы уверены, что хотите удалить этот день? Все задачи этого дня будут удалены.
      </p>
      
      <template #footer>
        <button 
          @click="hideConfirm"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
        <button 
          @click="confirmRemoveDay"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
        >
          Удалить
        </button>
      </template>
    </ModalDialog>

    <div class="flex items-center gap-4 min-h-[80px] overflow-x-auto pb-2">
      <div 
        v-for="day in days" 
        :key="day.id"
        class="flex-shrink-0 relative group"
      >
        <button 
          @click="emit('day-selected', day.id)"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="{
            'bg-blue-500 text-white': currentDay === day.id,
            'bg-gray-100 hover:bg-gray-200': currentDay !== day.id
          }"
        >
          {{ formatDate(day.date) }}
        </button>
        <button 
          v-if="days.length > 1"
          @click="initiateRemoveDay(day.id)"
          class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
          title="Удалить день"
        >
          ×
        </button>
      </div>
      <button 
        @click="addNewDay"
        class="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex-shrink-0"
      >
        + Добавить день
      </button>
    </div>


  </div>
</template>
