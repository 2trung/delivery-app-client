import { View, Image, Text, StyleSheet, Pressable } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Restaurant } from '@/types/type'

const VerticalRestaurantCard = ({
  restaurant,
}: {
  restaurant: Omit<Restaurant, 'categories'>
}) => {
  const router = useRouter()
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: '/food/Restaurant',
          params: { id: restaurant.id },
        })
      }
    >
      <Image
        source={{
          uri: restaurant.image,
        }}
        style={styles.image}
      />
      <View style={styles.detailContainer}>
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 12, color: '#525453' }}>
            {restaurant.distance.toFixed(2)} km • 12-15 phút
          </Text>
          <Text numberOfLines={2} style={{ fontWeight: '700', fontSize: 16 }}>
            {restaurant.name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <AntDesign name='star' size={16} color='#ef6400' />
          <Text style={{ color: '#494a4a', fontSize: 12, fontWeight: '500' }}>
            {restaurant.rating} • {restaurant.reviewCount} đánh giá
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default VerticalRestaurantCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 170,
    height: 260,
    elevation: 3,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  image: {
    height: 140,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  detailContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
})
