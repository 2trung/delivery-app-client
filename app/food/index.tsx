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
import { getFoodCollections, getNearbyRestaurants } from '@/api/foodAPI'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import HorizontalRestaurantCard from '@/components/HorizontalRestaurantCard'
import VerticalRestaurantCard from '@/components/VerticalRestaurantCard'

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

      <Text style={styles.title}>Bộ sưu tập các món ăn</Text>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 0 }}
        >
          {foodCollectionsData &&
            foodCollectionsData?.data?.map((collection: any) => (
              <View
                key={collection.id}
                style={{ alignItems: 'center', paddingHorizontal: 10 }}
              >
                <Image
                  source={{ uri: collection.image }}
                  style={{
                    height: 70,
                    width: 70,
                    borderRadius: 100,
                  }}
                />
                <Text>{collection.name}</Text>
              </View>
            ))}
        </ScrollView>
      </View>
      <Text style={styles.title}>Quán ngon quanh đây</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
        data={nearByRestaurantsData?.data?.content || []}
        renderItem={({ item }) => <VerticalRestaurantCard restaurant={item} />}
      />
      {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ padding: 10 }}
        > */}
      {/* </ScrollView> */}

      {/* <View>
        <View
          style={{
            borderRadius: 20,
            width: 310,
            height: 140,
            elevation: 5,
            backgroundColor: '#fff',
            marginBottom: 10,
            flexDirection: 'row',
          }}
        >
          <Image
            source={{
              uri: 'https://media.be.com.vn/bizops/image/fb93cc00-8750-11ee-8e31-f638ae20f033/original',
            }}
            style={{
              height: 140,
              width: 140,
              resizeMode: 'cover',
              borderRadius: 20,
            }}
          />
          <View
            style={{
              padding: 12,
              flex: 1,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, color: '#525453' }}>
                0.2 km • 12-15 phút
              </Text>
              <Text
                numberOfLines={2}
                style={{ fontWeight: '700', fontSize: 16 }}
              >
                Phở Bò
              </Text>
              <Text
                numberOfLines={1}
                style={{ fontSize: 12, color: '#494b4a', fontWeight: '600' }}
              >
                Phở Bò Nam Định - Bùi Huy Bích
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 12 }}>15.000đ</Text>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: '#494a4a',
                  fontSize: 12,
                }}
              >
                20.000đ
              </Text>
            </View>
          </View>
        </View>
      </View> */}
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
