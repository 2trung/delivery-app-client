import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native'
import { getRestaurantDetail } from '@/api/foodAPI'
import { useQuery } from '@tanstack/react-query'
import { icons } from '@/constants'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import VerticalFoodCard from '@/components/VerticalFoodCard'
import { useRef } from 'react'
import { Dimensions } from 'react-native'

const Restaurant = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurantDetail'],
    queryFn: () => {
      return getRestaurantDetail(id as string)
    },
    enabled: true,
  })

  const animatedValue = useRef(new Animated.Value(0)).current

  const opacity = animatedValue.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  return (
    <View style={{ backgroundColor: '#fff' }}>
      <View>
        <Image style={styles.cover} source={{ uri: data?.image }} />
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: opacity,
            },
          ]}
        />
      </View>
      <View style={styles.topButtonGroupContainer}>
        <SafeAreaView
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
        >
          {/* Nút phía trên bên trái */}
          <View style={styles.topLeftButtonGroupContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <AntDesign name='arrowleft' size={28} color='494b4a' />
            </TouchableOpacity>
            <Animated.View style={{ opacity }}>
              <Text style={{ fontSize: 18, fontWeight: '700' }}>
                {data?.name && data?.name?.length > 20
                  ? data.name.slice(0, 19) + '..'
                  : data?.name}
              </Text>
            </Animated.View>
          </View>
          {/* Nút phía trên bên phải */}
          <View style={styles.topRightButtonGroupContainer}>
            <TouchableOpacity style={styles.heartButton}>
              <AntDesign name='hearto' size={24} color='#494b4a' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name='share-social-sharp' size={24} color='#494b4a' />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <Animated.FlatList
        data={data?.categories}
        keyExtractor={(category) => category.id.toString()}
        style={{ marginTop: 10 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={(e) => animatedValue.setValue(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        renderItem={({ item: category }) => (
          <View key={category.id} style={{ paddingHorizontal: 16 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              {category.name}
            </Text>
            <View
              style={{
                marginBottom: 20,
                borderStyle: 'dashed',
                borderTopWidth: 1,
                borderColor: '#dfdfdf',
              }}
            />
            <FlatList
              data={category.foods}
              keyExtractor={(food) => food.id.toString()}
              renderItem={({ item }) => <VerticalFoodCard food={item} />}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.restaurantDetailContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignContent: 'center',
                gap: 10,
              }}
            >
              <Text style={styles.restaurantName} numberOfLines={3}>
                {data?.name}
              </Text>

              <View
                style={{
                  flexDirection: 'column',
                  borderRadius: 20,
                }}
              >
                <Text style={styles.rating}>
                  {data?.rating}{' '}
                  <AntDesign name='star' size={16} color='#fff' />
                </Text>
                <Text style={styles.ratingCount}>
                  {data?.reviewCount && data?.reviewCount > 50
                    ? '50+'
                    : data?.reviewCount}{' '}
                  đánh giá
                </Text>
              </View>
            </View>
            <Text style={styles.merchantCategoryName}>
              {data?.merchantCategoryName}
            </Text>
            <View style={styles.dividerLine} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 15,
                  alignItems: 'center',
                }}
              >
                <Image
                  source={icons.deliveryFood}
                  style={{ height: 18, width: 18 }}
                />
                <View>
                  <Text style={{ fontWeight: '500' }}>Giao hàng</Text>
                  <Text style={styles.merchantCategoryName}>
                    25-30 phút (4 km)
                  </Text>
                </View>
              </View>
              <Ionicons name='chevron-forward' size={24} color='black' />
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default Restaurant

const styles = StyleSheet.create({
  cover: {
    height: 180,
    resizeMode: 'cover',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    height: 180,
  },
  closeButton: {
    borderRadius: 100,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heartButton: {
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  topButtonGroupContainer: {
    // alignItems: 'center',
    // backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  topLeftButtonGroupContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  topRightButtonGroupContainer: { flexDirection: 'row', gap: 15 },
  restaurantDetailContainer: {
    padding: 20,
    // height: 200,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginTop: 40,
    elevation: 5,
    marginHorizontal: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    flexShrink: 1,
  },
  merchantCategoryName: {
    fontSize: 12,
    color: '#666',
  },
  dividerLine: {
    height: 1,
    marginVertical: 20,
    backgroundColor: '#dfdfdf',
  },
  rating: {
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#00880c',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    gap: 5,
    textAlign: 'center',
  },
  ratingCount: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 12,
    elevation: 3,
  },
})
