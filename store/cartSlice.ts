import { create } from 'zustand'
import { Food, Restaurant } from '@/types/type'

interface FoodWithQuantity extends Food {
  quantity: number
  total: number
}

interface CartStore {
  restaurant: Restaurant | null
  foods: FoodWithQuantity[]
  customizingFood: FoodWithQuantity | null
  totalCart: number
  addFood: (foods: FoodWithQuantity) => void
  removeFood: (foods: FoodWithQuantity) => void
  setCustomizingFood: (food: FoodWithQuantity) => void
  onChangeOption: (customizeId: string, optionId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  restaurant: null,
  customizingFood: null,
  foods: [],
  totalCart: 0,
  addFood: (foods) =>
    set((state) => {
      const index = state.foods.findIndex((f) => f.id === foods.id)
      if (index !== -1 && compareWithoutQuantity(state.foods[index], foods)) {
        state.foods[index].quantity += foods.quantity
      } else {
        state.foods.push(foods)
      }
      return {
        foods: [...state.foods],
        total: state.totalCart + foods.total,
      }
    }),
  removeFood: (foods) =>
    set((state) => {
      const index = state.foods.findIndex((f) => f.id === foods.id)
      if (index !== -1) {
        state.foods[index].quantity -= 1
        if (state.foods[index].quantity === 0) {
          state.foods.splice(index, 1)
        }
      }
      return {
        foods: [...state.foods],
        total: state.totalCart - foods.total,
      }
    }),
  clearCart: () =>
    set(() => ({
      restaurant: null,
      foods: [],
      total: 0,
    })),
  setCustomizingFood: (food) =>
    set(() => ({ customizingFood: { ...food, quantity: 1 } })),
  onChangeOption: (customizeId, optionId) =>
    set((state) => {
      if (!state.customizingFood) return {}
      const customize = state.customizingFood.customizes.find(
        (customize) => customize.id === customizeId
      )

      if (customize && customize.maximumChoices === 1) {
        const updatedCustomizes = state.customizingFood.customizes.map(
          (customize) =>
            customize.id === customizeId
              ? {
                  ...customize,
                  options: customize.options.map((option) =>
                    option.id === optionId
                      ? { ...option, isSelected: true }
                      : { ...option, isSelected: false }
                  ),
                }
              : customize
        )

        const total =
          updatedCustomizes.reduce((acc, customize) => {
            return (
              acc +
              customize.options.reduce((sum, option) => {
                return sum + (option.isSelected ? option.price : 0)
              }, 0)
            )
          }, 0) + state.customizingFood.price

        return {
          customizingFood: {
            ...state.customizingFood,
            customizes: updatedCustomizes,
            total,
          },
        }
      }

      if (customize && customize.maximumChoices > 1) {
        const updatedCustomizes = state.customizingFood.customizes.map(
          (customize) =>
            (customize.id === customizeId &&
              customize.maximumChoices >
                customize.options.filter((option) => option.isSelected)
                  .length) ||
            customize.options.find((option) => option.id === optionId)
              ?.isSelected
              ? {
                  ...customize,
                  options: customize.options.map((option) =>
                    option.id === optionId
                      ? { ...option, isSelected: !option.isSelected }
                      : option
                  ),
                }
              : customize
        )

        const total =
          updatedCustomizes.reduce((acc, customize) => {
            return (
              acc +
              customize.options.reduce((sum, option) => {
                return sum + (option.isSelected ? option.price : 0)
              }, 0)
            )
          }, 0) + state.customizingFood.price

        return {
          customizingFood: {
            ...state.customizingFood,
            customizes: updatedCustomizes,
            total,
          },
        }
      }

      return {}
    }),
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
