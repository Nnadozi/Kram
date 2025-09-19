import { useState } from 'react'

interface UseModalReturn {
  visible: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Custom hook for managing modal state
 * Eliminates boilerplate for modal visibility management
 * 
 * @param initialVisible - Initial visibility state (default: false)
 * @returns Object with visibility state and control functions
 * 
 * @example
 * const modal = useModal()
 * // or with initial state
 * const modal = useModal(true)
 * 
 * return (
 *   <>
 *     <Button onPress={modal.open}>Show Modal</Button>
 *     <Modal visible={modal.visible} onRequestClose={modal.close}>
 *       <Button onPress={modal.close}>Close</Button>
 *     </Modal>
 *   </>
 * )
 */
export const useModal = (initialVisible: boolean = false): UseModalReturn => {
  const [visible, setVisible] = useState(initialVisible)

  const open = () => setVisible(true)
  const close = () => setVisible(false)
  const toggle = () => setVisible(prev => !prev)

  return {
    visible,
    open,
    close,
    toggle
  }
}

/**
 * Hook for managing multiple modals with named keys
 * Useful when you have several modals in one component
 * 
 * @example
 * const modals = useMultipleModals(['create', 'edit', 'delete'])
 * 
 * return (
 *   <>
 *     <Button onPress={() => modals.open('create')}>Create</Button>
 *     <Button onPress={() => modals.open('edit')}>Edit</Button>
 *     
 *     <Modal visible={modals.isOpen('create')} onRequestClose={() => modals.close('create')}>
 *       Create content
 *     </Modal>
 *     
 *     <Modal visible={modals.isOpen('edit')} onRequestClose={() => modals.close('edit')}>
 *       Edit content
 *     </Modal>
 *   </>
 * )
 */
export const useMultipleModals = (modalKeys: string[]) => {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set())

  const open = (key: string) => {
    setOpenModals(prev => new Set(prev).add(key))
  }

  const close = (key: string) => {
    setOpenModals(prev => {
      const newSet = new Set(prev)
      newSet.delete(key)
      return newSet
    })
  }

  const closeAll = () => {
    setOpenModals(new Set())
  }

  const toggle = (key: string) => {
    setOpenModals(prev => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  const isOpen = (key: string) => openModals.has(key)

  const anyOpen = openModals.size > 0

  return {
    open,
    close,
    closeAll,
    toggle,
    isOpen,
    anyOpen,
    openModals: Array.from(openModals)
  }
}

/**
 * Hook for modal with confirmation dialog
 * Useful for destructive actions that need confirmation
 * 
 * @example
 * const deleteModal = useConfirmModal({
 *   onConfirm: () => deleteItem(),
 *   title: 'Delete Item',
 *   message: 'Are you sure you want to delete this item?'
 * })
 * 
 * return (
 *   <>
 *     <Button onPress={deleteModal.show}>Delete</Button>
 *     {deleteModal.renderModal()}
 *   </>
 * )
 */
interface ConfirmModalConfig {
  onConfirm: () => void
  onCancel?: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export const useConfirmModal = (config: ConfirmModalConfig) => {
  const [visible, setVisible] = useState(false)

  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  const handleConfirm = () => {
    config.onConfirm()
    hide()
  }

  const handleCancel = () => {
    config.onCancel?.()
    hide()
  }

  const renderModal = () => {
    // This would need to be implemented with your specific Alert/Modal component
    // For now, returning the state and handlers for manual implementation
    return {
      visible,
      title: config.title || 'Confirm',
      message: config.message || 'Are you sure?',
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      onConfirm: handleConfirm,
      onCancel: handleCancel
    }
  }

  return {
    visible,
    show,
    hide,
    renderModal
  }
}
