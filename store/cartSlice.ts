import { create } from 'zustand'
import { Food, Restaurant } from '@/types/type'

interface FoodWithQuantity extends Food {
  quantity: number
}

interface CartStore {
  restaurant: Restaurant | null
  food: FoodWithQuantity[]
  total: number
  addFood: (food: FoodWithQuantity) => void
  removeFood: (food: FoodWithQuantity) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  restaurant: null,
  food: [],
  total: 0,
  addFood: (food) =>
    set((state) => {
      const index = state.food.findIndex((f) => f.id === food.id)
      if (index !== -1 && compareWithoutQuantity(state.food[index], food)) {
        state.food[index].quantity += food.quantity
      } else {
        state.food.push(food)
      }
      return {
        food: [...state.food],
        total: state.total + food.price,
      }
    }),
  removeFood: (food) =>
    set((state) => {
      const index = state.food.findIndex((f) => f.id === food.id)
      if (index !== -1) {
        state.food[index].quantity -= 1
        if (state.food[index].quantity === 0) {
          state.food.splice(index, 1)
        }
      }
      return {
        food: [...state.food],
        total: state.total - food.price,
      }
    }),
  clearCart: () =>
    set(() => ({
      restaurant: null,
      food: [],
      total: 0,
    })),
}))

const compareWithoutQuantity = (
  item1: FoodWithQuantity,
  item2: FoodWithQuantity
) => {
  const { quantity: _, ...item1WithoutQuantity } = item1
  const { quantity: __, ...item2WithoutQuantity } = item2
  return (
    JSON.stringify(item1WithoutQuantity) ===
    JSON.stringify(item2WithoutQuantity)
  )
}
