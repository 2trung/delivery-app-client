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
export type RestaurantDetail = Omit<Restaurant, 'categories'>

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
export interface FoodWithQuantity extends Food {
  quantity: number
  total: number
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
export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
}
export interface Card {
  id: string
  brand: string
  last4: string
}

export interface RideOrderRequest {
  cost: number

  distance: number

  paymentMethod: PaymentMethod

  cardId?: string

  locations: Location[]
}
export interface CreateDeliveryOrderRequest {
  cod?: number
  deliveryCost: number
  distance: number
  productSize: string
  productCategory: string
  paymentMethod: PaymentMethod
  note?: string
  senderName: string
  senderPhone: string
  receiverName: string
  receiverPhone: string
  locations: Location[]
  cardId?: string
}

export interface CreateFoodOrderRequest {
  restaurantId: string
  totalFoodCost: number
  totalDeliveryCost: number
  paymentMethod: string
  deliveryLocation: Omit<Location, 'sequence' | 'locationType'>
  foodOrderItems: FoodOrderItemRequest[]
  cardId?: string
}

export interface FoodOrderItemRequest {
  id: string
  quantity: number
  note: string
  customizes: Customize[]
}

export interface Customize {
  id: string
  optionIds: string[]
}

export interface LocationDetail {
  latitude: number
  longitude: number
  address_line1: string
  address_line2: string
}
export interface DeliveryLocation {
  name: string
  phoneNumber: string
  latitude: number
  longitude: number
  addressLine1: string
  addressLine2: string
  sequence: number
}

export interface Route {
  path: Node[]
  distance: number
  duration: string
  cost: number
}

export interface Node {
  latitude: number
  longitude: number
}

export enum ProductCategory {
  FOOD = 'FOOD',
  CLOTHING = 'CLOTHING',
  DOCUMENT = 'DOCUMENT',
  PHARMACY = 'PHARMACY',
  BOOK = 'BOOK',
  OTHER = 'OTHER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  WAITING_FOR_ACCEPTANCE = 'WAITING_FOR_ACCEPTANCE',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
export enum OrderType {
  DELIVERY = 'DELIVERY',
  FOOD_DELIVERY = 'FOOD_DELIVERY',
  RIDE = 'RIDE',
}
export enum Weight {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}
export enum OrderStage {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  WAITING_FOR_ACCEPTANCE = 'WAITING_FOR_ACCEPTANCE',
  ARRIVING = 'ARRIVING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
export interface OrderResponse {
  id: string
  driver: Driver
  user: User
  status: OrderStatus
  createdAt: string
  cost: number
  distance: number
  paymentMethod: string
  orderType: string
  locationSequence: number
  locations: Location[]
  foodOrderItems: FoodOrderItem[] | null
  deliveryOrderDetail: DeliveryOrderDetail | null
  clientSecret: string | null
}

export interface DeliveryOrderDetail {
  cod: number
  deliveryCost: number
  productSize: string
  productCategory: string
  note: string
  senderName: string
  senderPhone: string
  receiverName: string
  receiverPhone: string
}
export interface Location {
  addressLine1: string
  addressLine2: string
  latitude: number
  longitude: number
  locationType: LocationType
  sequence: number
}

export enum LocationType {
  PICKUP = 'PICKUP',
  DROPOFF = 'DROPOFF',
  RESTAURANT = 'RESTAURANT',
}

export interface User {
  id: string
  name: string
  phoneNumber: string
  email: string
  dob: Date
}

export interface Driver {
  user: User
  licensePlate: string
  vehicleModel: string
  idNumber: string
  latitude: number
  longitude: number
  rating: number
  ratingCount: number
  orderCount: number
  successOrderCount: number
  status: DriverStatus
  lastOnline: Date
  id: string
}
export enum DriverStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
}

export interface FoodOrderItem {
  food: Food
  quantity: number
  total: number
  note: string
  foodOrderItemCustomizes: FoodOrderItemCustomize[]
}

export interface Food {
  price: number
  oldPrice: number
  image: string
  name: string
  orderCount: number
  likeCount: number
}

export interface FoodOrderItemCustomize {
  name: string
  foodOrderItemCustomizeOptions: FoodOrderItemCustomizeOption[]
}

export interface FoodOrderItemCustomizeOption {
  name: string
  price: number
}

export interface OrderPreviewPageable {
  content: OrderPreview[]
  page: Page
}

export interface OrderPreview {
  id: string
  status: string
  createdAt: string
  cost: number
  orderType: string
  locations: Location[]
  foodOrderItems: FoodOrderPreview[]
}

export interface FoodOrderPreview {
  food: string
  quantity: number
  total: number
  note: string
}

export interface Page {
  size: number
  number: number
  totalElements: number
  totalPages: number
}
