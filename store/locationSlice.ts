import { create } from 'zustand'

interface Location {
  address_line1: string
  address_line2: string
  latitute: number
  longitute: number
}

interface LocationState {
  userLocation: Location | null
  origin: Location | null
  destination: Location | null
  searchResults: Location[]
  setUserLocation: (location: Location) => void
  setDestination: (location?: Location) => void
}

const createLocation = create<LocationState>((set) => ({
  userLocation: null,
  origin: null,
  destination: null,
  searchResults: [],
  setUserLocation: (location) =>
    set((state) => ({ ...state, userLocation: location })),
  setDestination: (location) =>
    set((state) => ({ ...state, destination: location })),
}))

export default createLocation
