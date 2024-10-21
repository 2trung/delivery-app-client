import axios from '@/utils/axiosInstance'
import { GEOAPIFY_KEY, GEOAPIFY_URL } from '@env'
import { LatLng } from 'react-native-maps'

const autocomplete = async (input: string, userLocation: LatLng) => {
  const response = await axios.get(
    `/autocomplete?text=${input}&lang=vi&bias=proximity:${userLocation.longitude},${userLocation.latitude}&filter=circle:105.85372617648932,21.028679425355676,20000&format=json&apiKey=${GEOAPIFY_KEY}`,
    {
      baseURL: GEOAPIFY_URL,
    }
  )
  return response.data
}

const reverse = async (coordinate: LatLng) => {
  const response = await axios.get(
    `/reverse?lat=${coordinate.latitude}&lon=${coordinate.longitude}&lang=vi&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`,
    {
      baseURL: GEOAPIFY_URL,
    }
  )
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
