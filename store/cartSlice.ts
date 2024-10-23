import { create } from 'zustand'

interface Restaurant {
  id: string
  name: string
  address: string
  display_address: string
  image: string
  latitude: number
  longitude: number
  rating: number
  review_count: number
}

interface Food {
  id: string
  price: number
  old_price: number
  image: string
  name: string
  order_count: number
  like_count: number
}
