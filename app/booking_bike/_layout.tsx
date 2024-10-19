import { Stack } from 'expo-router'
import SelectLocation from './SelectLocation'

export default function BookingBikeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='SelectLocation' />
    </Stack>
  )
}
