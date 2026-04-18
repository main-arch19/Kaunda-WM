'use client'

import { useToastContext } from '@/context/ToastContext'

export function useToast() {
  const { addToast } = useToastContext()
  return {
    toast: (message: string, type: 'success' | 'error' | 'info' = 'success') =>
      addToast(message, type),
  }
}
