export interface Restaurant {
  id: string
  name: string
  address: string
  displayAddress: string
  image: string
  latitude: number
  longitude: number
  phoneNumber: string
  reviewCount: number
  rating: number
  deliveryRadius: number
  merchantCategoryName: string
  distance: number
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  foods: Food[]
}

export interface Food {
  id: string
  price: number
  oldPrice: number
  image: string
  name: string
  orderCount: number
  likeCount: number
  customizes: FoodCustomize[]
}

export interface FoodFlashSale {
  id: string
  name: string
  image: string
  price: number
  oldPrice: number
  orderCount: number
  likeCount: number
  restaurantId: string
  restaurantName: string
  restaurantAddress: string
  restaurantLatitude: number
  restaurantLongitude: number
}

export interface FoodCustomize {
  id: string
  name: string
  minimumChoices: number
  maximumChoices: number
  options: FoodCustomizeOption[]
}

export interface FoodCustomizeOption {
  id: string
  name: string
  price: number
  isDefault: boolean
  isSelected: boolean | undefined
}

export interface FoodCollection {
  id: string
  name: string
  image: string
}
