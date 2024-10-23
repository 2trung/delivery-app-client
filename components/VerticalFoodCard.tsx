import { Food } from '@/types/type'
import { AntDesign } from '@expo/vector-icons'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from 'react-native'
const VerticalFoodCard = ({ food }: { food: Food }) => {
  return (
    <View
      style={styles.container}
      // onPress={() => router.push('/food/Restaurant')}
    >
      <Image
        source={{
          uri: food.image,
        }}
        style={styles.image}
      />
      <View style={styles.detailContainer}>
        <Text
          numberOfLines={2}
          style={{
            fontWeight: '700',
            fontSize: 16,
            height: 40,
          }}
        >
          {food.name}
        </Text>

        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Text style={{ color: '#494a4a', fontSize: 12, fontWeight: '500' }}>
            {food.price.toLocaleString('vi')} đ{' '}
            {food.oldPrice !== food.price && (
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: '#494a4a',
                  fontSize: 12,
                }}
              >
                {food.oldPrice.toLocaleString('vi')} đ
              </Text>
            )}
          </Text>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 15,
          }}
        >
          <TouchableOpacity>
            <AntDesign name='minuscircleo' size={24} color='#00880c' />
          </TouchableOpacity>
          <Text style={{ fontWeight: '800' }}>1</Text>
          <TouchableOpacity>
            <AntDesign name='pluscircleo' size={24} color='#00880c' />
          </TouchableOpacity>
        </View> */}
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={{ color: '#00880c', fontWeight: '800' }}>Thêm vào</Text>
      </TouchableOpacity>
    </View>
  )
}

export default VerticalFoodCard

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    width: 170,
    height: 280,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  image: {
    height: 170,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  detailContainer: {
    padding: 12,
    paddingBottom: 0,
  },
  addButton: {
    borderColor: '#00880c',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 10,
  },
})