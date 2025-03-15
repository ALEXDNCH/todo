<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const focusableElements = ref<HTMLElement[]>([])
let previousActiveElement: HTMLElement | null = null

// Обработчик нажатия Escape
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Обработчик Tab
function handleTab(e: KeyboardEvent) {
  if (!props.show || focusableElements.value.length === 0) return

  const firstElement = focusableElements.value[0]
  const lastElement = focusableElements.value[focusableElements.value.length - 1]
  
  if (e.shiftKey) { // Shift + Tab
    if (document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
  } else { // Tab
    if (document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }
}

// Обновляем список фокусируемых элементов
function updateFocusableElements() {
  if (!modalRef.value) return

  focusableElements.value = Array.from(
    modalRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[]
}

// Следим за изменением show
watch(() => props.show, async (newValue) => {
  if (newValue) {
    previousActiveElement = document.activeElement as HTMLElement
    await nextTick()
    updateFocusableElements()
    
    if (focusableElements.value.length > 0) {
      focusableElements.value[0].focus()
    }
  } else if (previousActiveElement) {
    previousActiveElement.focus()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('keydown', handleTab)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('keydown', handleTab)
})
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div v-if="show" class="modal-wrapper">
        <div 
          class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          @mousedown.self="emit('close')"
        >
        </div>

        <div 
          class="fixed inset-0 flex items-center justify-center p-4 z-50"
          @mousedown.self="emit('close')"
        >
          <div 
            ref="modalRef"
            class="w-full max-w-md bg-white rounded-lg shadow-xl transition-all duration-300"
            role="dialog"
            aria-modal="true"
          >
            <div class="p-4 bg-gray-50 border-b rounded-t-lg">
              <slot name="title"></slot>
            </div>
            
            <div class="p-4">
              <slot></slot>
            </div>
            
            <div class="p-4 bg-gray-50 border-t rounded-b-lg flex justify-end gap-2">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active .max-w-md,
.v-leave-active .max-w-md {
  transition: transform 0.3s ease-out;
}

.v-enter-from .max-w-md {
  transform: translateY(-20px);
}

.v-leave-to .max-w-md {
  transform: translateY(20px);
}
</style>
