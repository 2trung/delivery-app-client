import { Stack } from 'expo-router'

export default function DeliveryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='FillDeliveryDetail' />
      <Stack.Screen name='FillAddress' />
    </Stack>
  )
}
