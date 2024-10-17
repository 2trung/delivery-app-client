import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import axiosInstance from '../utils/axiosInstance'
import useAuthSlice from './authSlice'

type User = {
  id: number
  email: string
  username: string
  phoneNumber: string
}
type UserStore = {
  user: User | null
  getUser: () => Promise<void>
  logout: () => void
}

const createUser = create<UserStore>((set) => ({
  user: null,
  getUser: async () => {
    try {
      const response = await axiosInstance.get('/user')
      useAuthSlice.getState().setLogin(true)
      set(() => ({ user: response.data.data }))
    } catch (error: any) {}
  },
  logout: () => {
    SecureStore.deleteItemAsync('accessToken')
    SecureStore.deleteItemAsync('refreshToken')
    useAuthSlice.getState().removeAuth()
    set(() => ({ user: null }))
  },
}))

export default createUser
