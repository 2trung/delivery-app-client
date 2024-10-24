import axios from '@/utils/axiosInstance'
import { GEOAPIFY_KEY, GEOAPIFY_URL } from '@env'
import { LatLng } from 'react-native-maps'

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
  stops: LatLng[]
) => {
  const response = await axios.post('/route', { origin, destination, stops })
  return response.data
}

export { autocomplete, reverse, getRoute }
