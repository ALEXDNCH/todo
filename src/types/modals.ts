import type { Component } from 'vue'

export interface ModalData {
  component: Component
  props: Record<string, any>
}

export interface ModalOptions {
  title?: string
  content?: any
  onConfirm?: (data?: any) => void
  onCancel?: () => void
  onClose?: () => void
}

export interface AddDayModalProps {
  date?: Date
  onConfirm?: (date: Date) => void
  onClose?: () => void
}

export interface ConfirmDialogProps {
  message: string
  onConfirm?: () => void
  onCancel?: () => void
}
