import { View, Image, Text, StyleSheet, Pressable } from 'react-native'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { Restaurant } from '@/types/type'
import { useRouter } from 'expo-router'

const HorizontalRestaurantCard = ({
  restaurant,
}: {
  restaurant: Omit<Restaurant, 'categories'>
}) => {
  const router = useRouter()
  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: '/food/Restaurant',
          // params: { id: restaurant.id },
          params: { id: '73bed16c-5746-40c7-9312-947d3f7729fd' },
        })
      }
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: restaurant.image,
          }}
          style={styles.image}
        />
        <View style={styles.restaurantInfoContainer}>
          <View style={styles.restaurantRatingContainer}>
            <AntDesign name='star' size={16} color='#fff' />
            <Text style={styles.restaurantRating}>{restaurant.rating}</Text>
          </View>
          <View style={styles.deliveryContainer}>
            <View style={styles.deliveryTimeContainer}>
              <AntDesign name='star' size={16} color='#000' />
              <Text> 30-40 phút</Text>
            </View>
            <View style={styles.deliveryTime}>
              <Text>{restaurant.distance.toFixed(2)} km</Text>
            </View>
          </View>
        </View>
        <View style={styles.restaurantNameContainer}>
          <View style={{ gap: 6 }}>
            <Text numberOfLines={1} style={{ fontWeight: '700', fontSize: 16 }}>
              {restaurant.name}
            </Text>
            <Text style={{ fontSize: 12, color: '#525453' }} numberOfLines={1}>
              {restaurant.displayAddress}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.discountContainer}>
        <Ionicons name='alarm' size={20} color='#fff' />
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          Giảm giá 30%, tối đa 100k
        </Text>
      </View>
    </Pressable>
  )
}

export default HorizontalRestaurantCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: '100%',
    height: 275,
    elevation: 5,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  restaurantInfoContainer: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    top: 185,
    left: 16,
  },
  restaurantRatingContainer: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#00880c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  restaurantRating: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryContainer: {
    flexDirection: 'row',
    elevation: 5,
    borderRadius: 20,
  },
  deliveryTimeContainer: {
    backgroundColor: '#f1f2f4',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  deliveryTime: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  restaurantNameContainer: {
    padding: 12,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  discountContainer: {
    height: 60,
    backgroundColor: '#c95200',
    top: -16,
    zIndex: -1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 14,
    gap: 5,
  },
})
