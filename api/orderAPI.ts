import axios from '@/utils/axiosInstance'
import {
  CreateDeliveryOrderRequest,
  CreateFoodOrderRequest,
  OrderPreviewPageable,
  OrderResponse,
  RideOrderRequest,
} from '@/types/type'

const createRideOrder = async (data: RideOrderRequest) => {
  const response = await axios.post('/order/create-ride-order', data)
  return response.data.data
}
// : Promise<>
const createFoodOrder = async (data: CreateFoodOrderRequest) => {
  const response = await axios.post('/order/create-food-order', data)
  return response.data.data
}

const createDeliveryOrder = async (data: CreateDeliveryOrderRequest) => {
  const response = await axios.post('/order/create-delivery-order', data)
  return response.data.data
}

const getOrderDetail = async (orderId: string): Promise<OrderResponse> => {
  const response = await axios.get('/order', { params: { orderId } })
  return response.data.data
}

const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await axios.post('/order/cancel', { orderId })
  return response.data.data
}

const getMessages = async (orderId: string) => {
  const response = await axios.get('/chat/' + orderId)
  return response.data.data
}

const getAllOrders = async (
  size: number,
  page: number
): Promise<OrderPreviewPageable> => {
  const response = await axios.get('/order/all', { params: { size, page } })
  return response.data.data
}

const confirmPayment = async (orderId: string): Promise<OrderResponse> => {
  const response = await axios.post(`/order/${orderId}/confirm-payment`)
  return response.data.data
}
export {
  createRideOrder,
  getOrderDetail,
  createFoodOrder,
  createDeliveryOrder,
  cancelOrder,
  getMessages,
  getAllOrders,
  confirmPayment,
}
