import { FoodCollection, FoodFlashSale, Restaurant } from '@/types/type'
import axios from '@/utils/axiosInstance'

const getFoodCollections = async (): Promise<FoodCollection[]> => {
  const response = await axios.get('/food/collections')
  return response.data.data
}

const getRestaurantsByFoodCollection = async (id: String) => {
  const response = await axios.get('/food/collections', {
    params: {
      id,
    },
  })
  return response.data
}

const getRestaurantDetail = async (id: String): Promise<Restaurant> => {
  const response = await axios.get('/food/restaurant', {
    params: {
      id,
    },
  })
  return response.data.data
}

const getNearbyRestaurants = async (latitude: number, longitude: number) => {
  const response = await axios.get('/food/restaurants/nearby', {
    params: {
      latitude,
      longitude,
    },
  })
  return response.data.data.content
}

const getFlashSaleFood = async (): Promise<FoodFlashSale[]> => {
  const response = await axios.get('/food/flash-sale')
  return response.data.data.content
}

const discoverRestaurant = async (
  latitude: number,
  longitude: number,
  page: number
): Promise<Restaurant[]> => {
  const response = await axios.get('/food/restaurant/discovers', {
    params: {
      latitude,
      longitude,
      page,
    },
  })
  return response.data.data.content
}

export {
  getFoodCollections,
  getRestaurantsByFoodCollection,
  getRestaurantDetail,
  getNearbyRestaurants,
  getFlashSaleFood,
  discoverRestaurant,
}
