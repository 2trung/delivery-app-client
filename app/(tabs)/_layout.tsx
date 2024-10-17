import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { Platform } from 'react-native'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 68,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          alignSelf: 'center',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon: JSX.Element = (
            <Ionicons name='home-outline' size={24} color={'#fff'} />
          )
          size = 24
          switch (route.name) {
            case 'Home':
              icon = focused ? (
                <Ionicons name='home-sharp' size={24} color={'#FCC434'} />
              ) : (
                <Ionicons name='home-outline' size={24} color={'#fff'} />
              )
              break
            case 'History':
              icon = focused ? (
                <Ionicons name='document-text' size={24} color='#FCC434' />
              ) : (
                <Ionicons name='document-text-outline' size={24} color='#fff' />
              )
              break
            case 'Notification':
              icon = focused ? (
                <MaterialIcons name='notifications' size={24} color='#FCC434' />
              ) : (
                <MaterialIcons
                  name='notifications-none'
                  size={24}
                  color='#fff'
                />
              )
              break

            case 'User':
              icon = focused ? (
                <Ionicons name='person' size={24} color={'#FCC434'} />
              ) : (
                <Ionicons name='person-outline' size={24} color={'#fff'} />
              )
              break
          }
          return icon
        },
        tabBarActiveTintColor: '#FCC434',
        tabBarInactiveTintColor: '#fff',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          flex: 1,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
      })}
    >
      <Tabs.Screen name='Home' />
      <Tabs.Screen name='History' />
      <Tabs.Screen name='Notification' />

      {/* <Tabs.Screen
        name='User'
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name='cog' color={color} />
          ),
        }}
      /> */}
    </Tabs>
  )
}
