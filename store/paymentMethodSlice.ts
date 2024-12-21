import { create } from 'zustand'
import { PaymentMethod, Card } from '@/types/type'

interface PaymentMethodState {
  paymentMethod: PaymentMethod
  card: Card | null
  setPaymentMethod: (paymentMethod: PaymentMethod, card?: Card) => void
}

const usePaymentMethod = create<PaymentMethodState>((set) => ({
  paymentMethod: PaymentMethod.CASH,
  card: null,
  setPaymentMethod: (paymentMethod, card) => {
    if (paymentMethod === PaymentMethod.CASH) set({ paymentMethod, card: null })
    else if (card) set({ paymentMethod, card })
  },
}))

export default usePaymentMethod
