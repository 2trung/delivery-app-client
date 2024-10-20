import { create } from 'zustand'

interface Location {
  address_line1: string
  address_line2: string
  latitude: number
  longitude: number
}

interface LocationState {
  userLocation: Location
  origin: Location | null
  destination: Location | null
  searchResults: Location[]
  setUserLocation: (location: Location) => void
  setDestination: (location?: Location) => void
  setOrigin: (location?: Location) => void
}

const createLocation = create<LocationState>((set) => ({
  userLocation: {
    address_line1: '',
    address_line2: '',
    latitude: 0,
    longitude: 0,
  },
  origin: null,
  destination: null,
  searchResults: [],
  setUserLocation: (location) =>
    set((state) => ({ ...state, userLocation: location })),
  setDestination: (location) =>
    set((state) => ({ ...state, destination: location })),
  setOrigin: (location) => set((state) => ({ ...state, origin: location })),
}))

export default createLocation
