import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { BaseApiResponse } from '../shared/baseApiResponse'
import { UserDataResponse } from '../shared/userDataResponse'
import { API_ROOT } from '@/utils/apiRoot'

interface AuthState {
  isLogin: boolean
  phoneNumber: string
  otp: string
  accessToken: string
  refreshToken: string
  error: string | null
  loading: boolean
  login: (phoneNumber: string, password: string) => Promise<void>
  register: (
    phoneNumber: string,
    password: string,
    name: string,
    email: string,
    otp: string
  ) => Promise<void>
  checkPhoneNumber: (
    phoneNumber: string
  ) => Promise<BaseApiResponse<{ nextAction: string; existingUser: boolean }>>
  verifyOtp: (
    phoneNumber: string,
    otp: string
  ) => Promise<BaseApiResponse<{ message: string }>>
  resendOtp: (phoneNumber: string) => Promise<void>
  forgotPassword: (phoneNumber: string) => Promise<void>
  resetPassword: (
    phoneNumber: string,
    password: string,
    otp: string
  ) => Promise<void>
  clearError: () => void
  removeAuth: () => void
  setLogin: (isLogin: boolean) => void
}

const axiosInstance = axios.create({
  baseURL: API_ROOT,
})

const createAuth = create<AuthState>((set) => ({
  isLogin: false,
  phoneNumber: '',
  otp: '',
  accessToken: SecureStore.getItem('accessToken') || '',
  refreshToken: SecureStore.getItem('refreshToken') || '',
  error: null,
  loading: false,
  login: async (phoneNumber: string, password: string) => {
    try {
      set(() => ({ error: null, loading: true }))
      const response = await axiosInstance.post('/auth/login', {
        phoneNumber,
        password,
      })
      const accessToken = response.data.data.accessToken
      const refreshToken = response.data.data.refreshToken
      set(() => ({
        isLogin: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        error: null,
        loading: false,
      }))
      await SecureStore.setItemAsync('accessToken', accessToken)
      await SecureStore.setItemAsync('refreshToken', refreshToken)
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
      throw error
    }
  },
  register: async (
    phoneNumber: string,
    password: string,
    name: string,
    email: string,
    otp: string
  ) => {
    try {
      set(() => ({ error: null, loading: true }))
      const response = await axiosInstance.post('/auth/register', {
        phoneNumber,
        password,
        name,
        email,
        otp,
      })
      set(() => ({ error: null, loading: false }))
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
      throw error
    }
  },
  checkPhoneNumber: async (phoneNumber: string) => {
    try {
      set(() => ({ error: null, loading: true }))
      const response = await axiosInstance.post('/auth/phone-number', {
        phoneNumber,
      })
      set(() => ({ phoneNumber, error: null, loading: false }))
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
      throw error
    }
  },
  verifyOtp: async (phoneNumber: string, otp: string) => {
    try {
      set(() => ({ error: null, loading: true }))
      const response = await axiosInstance.post('/auth/verify-otp', {
        phoneNumber,
        otp,
      })
      set(() => ({ otp, error: null, loading: false }))
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
      throw error
    }
  },
  resendOtp: async (phoneNumber: string) => {
    try {
      set(() => ({ error: null, loading: true }))
      const response = await axiosInstance.post('/auth/resend-otp', {
        phoneNumber,
      })
      set(() => ({ error: null, loading: false }))
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
      throw error
    }
  },
  forgotPassword: async (phoneNumber: string) => {
    try {
      set(() => ({ error: null, loading: false }))
      const response = await axiosInstance.post('/auth/forgot-password', {
        phoneNumber,
      })
      set(() => ({ error: null, loading: false }))
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
      throw error
    }
  },
  resetPassword: async (phoneNumber: string, password: string, otp: string) => {
    try {
      set(() => ({ error: null, loading: true }))
      const response = await axiosInstance.post('/auth/reset-password', {
        phoneNumber,
        password,
        otp,
      })
      set(() => ({ error: null, loading: false }))
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response.data.message || error.data.message || 'Có lỗi xảy ra'
      set(() => ({
        error: errorMessage,
        loading: false,
      }))
    }
  },
  clearError: () => {
    set(() => ({ error: null }))
  },
  removeAuth: () => {
    set(() => ({
      isLogin: false,
      accessToken: '',
      refreshToken: '',
      error: null,
      loading: false,
    }))
    SecureStore.deleteItemAsync('accessToken')
    SecureStore.deleteItemAsync('refreshToken')
  },
  setLogin: (isLogin: boolean) => {
    set(() => ({ isLogin }))
  },
}))

export default createAuth
