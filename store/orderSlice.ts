import { OrderStage, OrderResponse, OrderStatus } from '@/types/type'
import { create } from 'zustand'

interface OrderState {
  order: OrderResponse | null
  setOrder: (order: OrderResponse | null) => void
  setOrderStatus: (status: OrderStatus) => void
  clearOrder: () => void
}

const useOrder = create<OrderState>((set) => ({
  order: null,
  setOrder: (order) => {
    if (order) {
      order?.locations?.sort((a, b) => a.sequence - b.sequence)
    }
    set(() => ({ order }))
  },
  setOrderStatus: (status) => {
    set((state) => {
      if (state.order) {
        return { order: { ...state.order, status } }
      }
      return state
    })
  },
  clearOrder: () => {
    set(() => ({ order: null }))
  },
}))

export default useOrder
