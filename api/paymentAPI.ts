import axios from '@/utils/axiosInstance'

const setupIntent = async (): Promise<{ clientSecret: string }> => {
  const response = await axios.post('/stripe/setup-intent')
  return response.data.data
}
const getPaymentMethods = async (): Promise<
  { id: string; brand: string; last4: string }[]
> => {
  const response = await axios.get('/stripe/payment-methods')
  return response.data.data
}
export { setupIntent, getPaymentMethods }
