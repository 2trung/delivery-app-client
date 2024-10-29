import { create } from 'zustand'
import { Food } from '@/types/type'

interface FoodStore {
  food: Food | null
  quantity: number
  total: number
  setFood: (food: Food) => void
  onChangeQuantity: (type: 'INCREASE' | 'DECREASE') => void
  onChangeOption: (customizeId: string, optionId: string) => void
  isValid: () => boolean
}
export const foodSlice = create<FoodStore>((set) => ({
  food: null,
  quantity: 0,
  total: 0,
  setFood: (food) => set(() => ({ food, quantity: 1, total: food.price })),
  onChangeOption: (customizeId, optionId) =>
    set((state) => {
      if (!state.food) return {}
      const customize = state.food.customizes.find(
        (customize) => customize.id === customizeId
      )

      if (customize && customize.maximumChoices === 1) {
        const updatedCustomizes = state.food.customizes.map((customize) =>
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
          }, 0) + state.food.price

        return {
          food: {
            ...state.food,
            customizes: updatedCustomizes,
          },
          total,
        }
      }

      if (customize && customize.maximumChoices > 1) {
        const updatedCustomizes = state.food.customizes.map((customize) =>
          (customize.id === customizeId &&
            customize.maximumChoices >
              customize.options.filter((option) => option.isSelected).length) ||
          customize.options.find((option) => option.id === optionId)?.isSelected
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
          }, 0) + state.food.price

        return {
          food: {
            ...state.food,
            customizes: updatedCustomizes,
          },
          total,
        }
      }

      return {}
    }),
  onChangeQuantity: (type) => {
    set((state) => {
      if (!state.food) return {}
      if (state.quantity === 1 && type === 'DECREASE') return {}
      const quantity =
        type === 'INCREASE' ? state.quantity + 1 : state.quantity - 1
      return { quantity }
    })
  },
  isValid: () => {
    const state = foodSlice.getState()
    if (!state.food) return false
    for (const customize of state.food.customizes) {
      const selectedOptionsCount = customize.options.filter(
        (option) => option.isSelected
      ).length
      if (
        selectedOptionsCount < customize.minimumChoices ||
        selectedOptionsCount > customize.maximumChoices
      ) {
        return false
      }
    }
    return true
  },
}))

export default foodSlice
