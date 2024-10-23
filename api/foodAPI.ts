import { Restaurant } from '@/types/type'
import axios from '@/utils/axiosInstance'

const getFoodCollections = async () => {
  const response = await axios.get('/food/collections')
  return response.data
}
const getRestaurantsByFoodCollection = async (id: String) => {
  const response = await axios.get(`/food/collections?id=${id}`)
  return response.data
}
const getRestaurantDetail = async (id: String): Promise<Restaurant> => {
  const response = await axios.get(`/food/restaurant?id=${id}`)
  return response.data.data
}
const getNearbyRestaurants = async (latitude: number, longitude: number) => {
  const response = await axios.get(
    `/food/restaurants/nearby?latitude=${latitude}&longitude=${longitude}`
  )
  return response.data
}

export {
  getFoodCollections,
  getRestaurantsByFoodCollection,
  getRestaurantDetail,
  getNearbyRestaurants,
}
