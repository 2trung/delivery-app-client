import { create } from 'zustand'
import {
  FoodWithQuantity,
  LocationDetail,
  RestaurantDetail,
} from '@/types/type'

interface CartStore {
  originAddress: LocationDetail | null
  restaurant: RestaurantDetail | null
  foods: FoodWithQuantity[]
  customizingFood: FoodWithQuantity | null
  totalCart: number
  setOriginAddress: (originAddress: LocationDetail) => void
  onChangeQuantity: (
    food: FoodWithQuantity,
    type: 'INCREASE' | 'DECREASE'
  ) => void
  setRestaurant: (restaurant: RestaurantDetail | null) => void
  addFood: (foods: FoodWithQuantity) => void
  removeFood: (food: FoodWithQuantity) => void
  setCustomizingFood: (food: FoodWithQuantity) => void
  onChangeOption: (customizeId: string, optionId: string) => void
  clearCart: () => void
}

const useCartStore = create<CartStore>((set) => ({
  originAddress: null,
  restaurant: null,
  customizingFood: null,
  foods: [],
  totalCart: 0,
  setOriginAddress: (originAddress) => {
    set((state) => ({ ...state, originAddress }))
  },
  setRestaurant: (restaurant: RestaurantDetail | null) =>
    set((state) => ({ ...state, restaurant })),
  onChangeQuantity: (food, type) => {
    if (type === 'INCREASE') {
      set((state) => {
        const foods = state.foods.filter((f) => f.id === food.id)
        const index = foods.findIndex((f) => compareWithoutQuantity(f, food))
        if (index !== -1) {
          state.foods[index].quantity += 1
        }
        return {
          foods: [...state.foods],
          totalCart: state.totalCart + food.price,
        }
      })
    } else {
      set((state) => {
        const foods = state.foods.filter((f) => f.id === food.id)
        const index = foods.findIndex((f) => compareWithoutQuantity(f, food))
        if (index !== -1) {
          state.foods[index].quantity -= 1
          if (state.foods[index].quantity === 0) {
            state.foods.splice(index, 1)
          }
        }
        return {
          foods: [...state.foods],
          totalCart: state.totalCart - food.price,
        }
      })
    }
  },
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
        totalCart: state.totalCart + foods.total,
      }
    }),
  removeFood: (food) =>
    set((state) => {
      const foods = state.foods.filter((f) => f.id === food.id)
      const index = foods.findIndex((f) => compareWithoutQuantity(f, food))
      if (index !== -1) state.foods.splice(index, 1)
      return {
        foods: [...state.foods],
        totalCart: state.totalCart - food.total,
      }
    }),
  clearCart: () =>
    set(() => ({
      restaurant: null,
      foods: [],
      totalCart: 0,
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
  const { total: _, quantity: __, ...item1WithoutQuantity } = item1
  const { total: ___, quantity: ____, ...item2WithoutQuantity } = item2
  return (
    JSON.stringify(item1WithoutQuantity) == JSON.stringify(item2WithoutQuantity)
  )
}

export default useCartStore
