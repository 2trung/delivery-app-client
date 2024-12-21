import { create } from 'zustand'
import { LocationDetail } from '../types/type'

interface LocationState {
  userLocation: LocationDetail
  origin: LocationDetail | null
  destination: (LocationDetail | null)[]
  searchResults: LocationDetail[]
  setUserLocation: (location: LocationDetail) => void
  addDestination: () => void
  setDestination: (location: LocationDetail, index: number) => void
  removeDestination: (index: number) => void
  removeDestinations: () => void
  clearDestination: (index: number) => void
  setOrigin: (location?: LocationDetail) => void
}

const createLocation = create<LocationState>((set) => ({
  userLocation: {
    address_line1: '',
    address_line2: '',
    latitude: 0,
    longitude: 0,
  },
  origin: null,
  destination: [null],
  searchResults: [],
  setUserLocation: (location) =>
    set((state) => ({ ...state, userLocation: location })),
  addDestination: () =>
    set((state) => {
      const newDestination = [...state.destination]
      newDestination.push(null)
      return { ...state, destination: newDestination }
    }),
  setDestination: (location, index) => {
    set((state) => {
      const newDestination = [...state.destination]
      newDestination[index] = location
      return { ...state, destination: newDestination }
    })
  },
  removeDestination: (index) => {
    set((state) => {
      const newDestination = [...state.destination]
      newDestination.splice(index, 1)
      return { ...state, destination: newDestination }
    })
  },
  removeDestinations: () => {
    set((state) => ({
      ...state,
      destination: [null],
    }))
  },
  clearDestination: (index) => {
    set((state) => {
      const newDestination = [...state.destination]
      newDestination[index] = null
      return { ...state, destination: newDestination }
    })
  },
  setOrigin: (location) => set((state) => ({ ...state, origin: location })),
}))

export default createLocation
