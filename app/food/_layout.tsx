import { Stack } from 'expo-router'

export default function FoodLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='Restaurant' />
      <Stack.Screen name='FoodOption' />
    </Stack>
  )
}
