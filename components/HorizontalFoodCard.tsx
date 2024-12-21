import { FoodFlashSale } from '@/types/type'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { useRouter } from 'expo-router'

const HorizontalFoodCard = ({ food }: { food: FoodFlashSale }) => {
  const router = useRouter()
  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: '/food/Restaurant',
          params: { id: food.restaurantId, foodId: food.id },
        })
      }
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: food.image,
          }}
          style={styles.image}
        />
        <View style={styles.detailContainer}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, color: '#525453' }}>
              0.2 km • 12-15 phút
            </Text>
            <Text numberOfLines={2} style={{ fontWeight: '700', fontSize: 16 }}>
              {food.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: 12, color: '#494b4a', fontWeight: '600' }}
            >
              {food.restaurantName}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Text style={{ fontSize: 12 }}>
              {food.price.toLocaleString('vi')}đ
            </Text>
            <Text
              style={{
                textDecorationLine: 'line-through',
                color: '#494a4a',
                fontSize: 12,
              }}
            >
              {food.oldPrice.toLocaleString('vi')}đ
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default HorizontalFoodCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 310,
    height: 140,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexDirection: 'row',
  },
  image: {
    height: 140,
    width: 140,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  detailContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
})
