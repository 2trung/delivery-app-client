import { DeliveryLocation, ProductCategory, Weight } from '@/types/type'
import { create } from 'zustand'

interface DeliveryState {
  locations: DeliveryLocation[]
  weight: Weight | null
  category: ProductCategory | null
  cod: number
  note: string
  setLocations: (locations: DeliveryLocation[]) => void
  addLocation: (location: DeliveryLocation) => void
  swap: () => void
  updateLocation: (location: DeliveryLocation) => void
  setWeight: (weight: Weight) => void
  setCategory: (category: ProductCategory) => void
  setCod: (cod: number) => void
  setNote: (note: string) => void
  reset: () => void
}

const useDeliveryStore = create<DeliveryState>((set) => ({
  locations: [],
  weight: null,
  category: null,
  cod: 0,
  note: '',
  setLocations: (locations) => set(() => ({ locations })),
  addLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),
  swap: () =>
    set((state) => {
      const updatedLocations = state.locations.map((location) => {
        if (location.sequence === 1) {
          return { ...location, sequence: 2 }
        } else if (location.sequence === 2) {
          return { ...location, sequence: 1 }
        }
        return location
      })
      return { locations: updatedLocations }
    }),
  updateLocation: (location: DeliveryLocation) => {
    set((state) => {
      const isExist = state.locations.find(
        (loc) => loc.sequence == location.sequence
      )
      if (!isExist) {
        return { locations: [...state.locations, location] }
      } else {
        const updatedLocations = state.locations.map((loc) => {
          if (loc.sequence == location.sequence) {
            return location
          }
          return loc
        })
        return { locations: updatedLocations }
      }
    })
  },
  setWeight: (weight) => set(() => ({ weight })),
  setCategory: (category) => set(() => ({ category })),
  setCod: (cod) => set(() => ({ cod })),
  setNote: (note) => set(() => ({ note })),
  reset: () =>
    set(() => ({
      locations: [],
      weight: null,
      category: null,
      cod: 0,
      note: '',
    })),
}))

export default useDeliveryStore
