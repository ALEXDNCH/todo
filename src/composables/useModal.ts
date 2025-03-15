import { ref } from 'vue'

export function useModal() {
  const isOpen = ref(false)

  const show = () => {
    isOpen.value = true
  }

  const hide = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    show,
    hide
  }
}
