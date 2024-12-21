import { OrderType, Route, Weight } from '@/types/type'
import axios from '@/utils/axiosInstance'
import { LatLng } from 'react-native-maps'

const GEOAPIFY_URL = process.env.EXPO_PUBLIC_GEOAPIFY_URL
const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_KEY

const autocomplete = async (input: string, userLocation: LatLng) => {
  const response = await axios.get('/autocomplete', {
    baseURL: GEOAPIFY_URL,
    params: {
      text: input,
      lang: 'vi',
      bias: `proximity:${userLocation.longitude},${userLocation.latitude}`,
      filter: `circle:${userLocation.longitude},${userLocation.latitude},20000`,
      format: 'json',
      apiKey: GEOAPIFY_KEY,
    },
  })
  return response.data
}

const reverse = async (coordinate: LatLng) => {
  const response = await axios.get('/reverse', {
    baseURL: GEOAPIFY_URL,
    params: {
      lang: 'vi',
      limit: 1,
      lat: coordinate.latitude,
      lon: coordinate.longitude,
      format: 'json',
      apiKey: GEOAPIFY_KEY,
    },
  })
  return response.data
}

const getRoute = async (
  origin: LatLng,
  destination: LatLng,
  stops: LatLng[],
  orderType: OrderType,
  productSize?: Weight
): Promise<Route> => {
  const response = await axios.post('/route', {
    origin,
    destination,
    stops,
    orderType,
    productSize,
  })
  return response.data.data
}

export { autocomplete, reverse, getRoute }
