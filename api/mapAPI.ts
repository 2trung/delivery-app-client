import { Coordinates } from '@/type/coordinates'
import axios from '@/utils/axiosInstance'

const autocomplete = async (input: string, userLocation: Coordinates) => {
  // const geoapifyKey = process.env.GEOAPIFY_KEY
  const geoapifyKey = 'a43328fe7a084c0983d312b74a3ea003'
  const response = await axios.get(
    `/autocomplete?text=${input}&lang=vi&bias=proximity:${userLocation.longitute},${userLocation.latitute}&filter=circle:105.85372617648932,21.028679425355676,20000&format=json&apiKey=${geoapifyKey}`,
    {
      // baseURL: process.env.GEOAPIFY_URL,
      baseURL: 'https://api.geoapify.com/v1/geocode/',
    }
  )
  return response.data
}

const reverse = async (lat: string, lon: string) => {
  const geoapifyKey = process.env.GEOAPIFY_KEY
  const response = await axios.get(
    `/reverse?lat=${lat}&lon=${lon}&lang=vi&limit=1&format=json&apiKey=${geoapifyKey}`,
    {
      baseURL: process.env.GEOAPIFY_URL,
    }
  )
  return response.data
}

const getRoute = async (origin: Coordinates, destination: Coordinates) => {
  const response = await axios.get(
    `/route?origin=${origin.latitute},${origin.longitute}&destination=${destination.latitute},${destination.longitute}`
  )
  return response.data
}

export { autocomplete, reverse, getRoute }
