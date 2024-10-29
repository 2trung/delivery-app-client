import { Stack } from 'expo-router'

export default function FoodLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='Restaurant' />
      <Stack.Screen
        name='(modal)/CustomizeFood'
        options={{
          presentation: 'modal',
          headerTitle: 'Tuỳ chỉnh món ăn',
          headerShown: true,
        }}
      />
    </Stack>
  )
}
