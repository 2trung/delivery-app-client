import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import useUser from '@/store/userSlice'
import useAuth from '@/store/authSlice'
import { useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()
export default function RootLayout() {
  const router = useRouter()
  const { getUser } = useUser()
  const { isLogin } = useAuth()

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (!isLogin) {
      if (router.canGoBack()) router.replace('../')
      else router.replace('/')
    } else router.replace('/(tabs)/Home')
    SplashScreen.hideAsync()
  }, [isLogin])

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(auth)' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='+not-found' />
      </Stack>
    </ThemeProvider>
  )
}
