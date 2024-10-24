import { AntDesign, Feather, Fontisto, Ionicons } from '@expo/vector-icons'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useLocation from '@/store/locationSlice'
import { icons, images } from '@/constants'
import { useQuery } from '@tanstack/react-query'
import {
  getFoodCollections,
  getNearbyRestaurants,
  getFlashSaleFood,
  discoverRestaurant,
} from '@/api/foodAPI'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import HorizontalRestaurantCard from '@/components/HorizontalRestaurantCard'
import VerticalRestaurantCard from '@/components/VerticalRestaurantCard'
import HorizontalFoodCard from '@/components/HorizontalFoodCard'
import { FoodCollection, FoodFlashSale, Restaurant } from '@/types/type'

const FoodHome = () => {
  const { userLocation } = useLocation()
  const router = useRouter()
  const {
    data: foodCollectionsData,
    isLoading: isFoodCollectionsLoading,
    error: foodCollectionsError,
  } = useQuery({
    queryKey: ['foodCollections'],
    queryFn: () => {
      return getFoodCollections()
    },
    enabled: true,
  })
  const {
    data: nearByRestaurantsData,
    isLoading: isNearByRestaurantsLoading,
    error: nearByRestaurantsError,
  } = useQuery({
    queryKey: ['nearByRestaurants'],
    queryFn: () => {
      return getNearbyRestaurants(userLocation.latitude, userLocation.longitude)
    },
    enabled: true,
  })

  const { data: flashSaleFoodData } = useQuery({
    queryKey: ['flashSaleFood'],
    queryFn: () => {
      return getFlashSaleFood()
    },
    enabled: true,
  })

  const { data: discoverRestaurantData } = useQuery({
    queryKey: ['discoverRestaurant'],
    queryFn: () => {
      return discoverRestaurant(
        userLocation.latitude,
        userLocation.longitude,
        1
      )
    },
    enabled: true,
  })

  const selections = [
    {
      title: 'Bộ sưu tập các món ăn',
      data: foodCollectionsData,
      direction: 'horizontal',
      renderItem: ({ item }: { item: FoodCollection }) => (
        <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
          <Image
            source={{ uri: item.image }}
            style={{
              height: 70,
              width: 70,
              borderRadius: 100,
            }}
          />
          <Text>{item.name}</Text>
        </View>
      ),
    },
    {
      title: 'Quán ngon quanh đây',
      data: nearByRestaurantsData?.data?.content,
      direction: 'horizontal',
      renderItem: ({ item }: { item: Restaurant }) => (
        <VerticalRestaurantCard restaurant={item} />
      ),
    },
    {
      title: 'Flash sale',
      data: flashSaleFoodData,
      direction: 'horizontal',
      renderItem: ({ item }: { item: FoodFlashSale }) => (
        <HorizontalFoodCard food={item} />
      ),
    },
    {
      title: 'Khám phá quán mới',
      data: discoverRestaurantData,
      direction: 'vertical',
      renderItem: ({ item }: { item: Restaurant }) => (
        <HorizontalRestaurantCard restaurant={item} />
      ),
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút phía trên */}
      <View style={styles.topButtonGroupContainer}>
        {/* Nút phía trên bên trái */}
        <View style={styles.topLeftButtonGroupContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Feather name='x' size={28} color='#494b4a' />
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <Ionicons name='location-sharp' size={18} color='#DC3F3D' />
            <Text style={{ color: '#494b4a', fontSize: 14, fontWeight: '500' }}>
              {userLocation.address_line1
                ? userLocation.address_line1.length > 12
                  ? userLocation.address_line1.slice(0, 12) + '...'
                  : userLocation.address_line1
                : 'Chọn địa chỉ'}
            </Text>
          </View>
        </View>
        {/* Nút phía trên bên phải */}
        <View style={styles.topRightButtonGroupContainer}>
          <TouchableOpacity style={styles.heartButton}>
            <Fontisto name='heart' size={18} color='#494b4a' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.heartButton}>
            <Image source={icons.history} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
      <Pressable style={styles.search}>
        <AntDesign name='search1' size={24} color='#494b4a' />
        <Text style={{ color: '#757575', fontSize: 14 }}>Bạn muốn ăn gì?</Text>
      </Pressable>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={selections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <FlatList<any>
              horizontal={item.direction === 'horizontal'}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
              data={item.data || []}
              renderItem={item.renderItem}
            />
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default FoodHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  closeButton: {
    borderRadius: 100,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  heartButton: {
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  locationContainer: {
    flexDirection: 'row',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 2,
    alignItems: 'center',
  },
  topButtonGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topLeftButtonGroupContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  topRightButtonGroupContainer: { flexDirection: 'row', gap: 15 },
  search: {
    height: 42,
    backgroundColor: '#f7f7f7',
    borderRadius: 100,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 15,
  },
})
