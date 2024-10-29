import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import useUser from '@/store/userSlice'
import useAuth from '@/store/authSlice'
import useLocation from '@/store/locationSlice'
import { useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { StatusBar } from 'expo-status-bar'
import { reverse } from '@/api/mapAPI'
import { LatLng } from 'react-native-maps'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const router = useRouter()
  const queryClient = new QueryClient()
  const { getUser } = useUser()
  const { isLogin } = useAuth()
  const { setUserLocation } = useLocation()

  useEffect(() => {
    getUser()
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }
      const location = await Location.getCurrentPositionAsync({})
      const specificLocation = await reverse(location.coords as LatLng)
      setUserLocation({
        address_line1: specificLocation?.results[0]?.address_line1,
        address_line2: specificLocation?.results[0]?.address_line2,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    }
    getLocation()
  }, [])

  useEffect(() => {
    if (!isLogin) {
      if (router.canGoBack()) router.replace('../')
      else router.replace('/')
    } else router.replace('/(tabs)/Home')
    // router.replace('/(tabs)/Home')
    SplashScreen.hideAsync()
  }, [isLogin])

  return (
    <BottomSheetModalProvider>
      <StatusBar style='dark' />
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='index' />
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='booking_bike' />
          <Stack.Screen name='+not-found' />
        </Stack>
      </QueryClientProvider>
    </BottomSheetModalProvider>
  )
}
