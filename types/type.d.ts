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
  foodCustomizes: FoodCustomize[]
}

export interface FoodCustomize {
  id: string
  name: string
  minimumChoices: number
  maximumChoices: number
  foodCustomizeOptions: FoodCustomizeOption[]
}

export interface FoodCustomizeOption {
  id: string
  name: string
  price: number
  isDefault: boolean
}
