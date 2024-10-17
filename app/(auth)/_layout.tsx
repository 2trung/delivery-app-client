import { Stack, Tabs } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='InputOtp' />
      <Stack.Screen name='Login' />
      <Stack.Screen name='Register' />
      <Stack.Screen name='ResetPassword' />
    </Stack>
  )
}
