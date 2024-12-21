import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native'
import Checkbox from '@/components/Checkbox'
import RadioButton from '@/components/RadioButton'
import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'
import useFood from '@/store/foodSlice'
import useCart from '@/store/cartSlice'
import { useRouter } from 'expo-router'
import { FoodWithQuantity } from '@/types/type'

const CustomizeFood = () => {
  const [editingFood, setEditingFood] = useState<FoodWithQuantity | null>(null)
  const router = useRouter()
  const {
    onChangeOption,
    food,
    total,
    quantity,
    onChangeQuantity,
    isValid,
    type,
    resraurant: displayingRestaurant,
  } = useFood()
  const {
    restaurant: cartRestaurant,
    addFood,
    setRestaurant,
    clearCart,
    removeFood,
  } = useCart()

  const showAlert = () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Thông báo',
        'Bạn đang chọn món ăn từ nhà hàng khác, bạn có muốn xóa giỏ hàng hiện tại không?',
        [
          {
            text: 'Không',
            style: 'cancel',
            onPress: () => {
              return
            },
          },
          {
            text: 'Có',
            onPress: () => {
              clearCart()
            },
          },
        ],
        { cancelable: false }
      )
    })
  }
  const handleAddToCart = async () => {
    if (
      cartRestaurant &&
      displayingRestaurant &&
      cartRestaurant.id !== displayingRestaurant.id
    )
      await showAlert()
    if (!cartRestaurant) {
      setRestaurant(displayingRestaurant)
    }
    const isValidFood = isValid()
    if (food && isValidFood) {
      if (type === 'EDIT' && editingFood) {
        removeFood(editingFood)
      }
      addFood({ ...food, quantity, total })
      router.back()
    } else {
      ToastAndroid.show('Vui lòng chọn đủ các tùy chọn', ToastAndroid.SHORT)
    }
  }
  useEffect(() => {
    if (type === 'EDIT' && food) {
      setEditingFood({
        ...food,
        quantity: (food as FoodWithQuantity).quantity,
        total:
          (food as FoodWithQuantity).total *
          (food as FoodWithQuantity).quantity,
      })
    }
  }, [])

  if (!food) return null
  return (
    <View style={{ flexGrow: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.foodContainer}>
            <Image source={{ uri: food.image }} style={styles.foodImage} />
            <View style={styles.foodDetailContainer}>
              <Text
                style={{ fontSize: 20, fontWeight: '600' }}
                numberOfLines={2}
              >
                {food.name}
              </Text>
              <Text>{food.likeCount} đã thích</Text>
              <Text style={styles.foodPrice}>
                {food.price.toLocaleString('vi')} đ{' '}
                {food.oldPrice !== food.price && (
                  <Text style={styles.foodOldPrice}>
                    {food.oldPrice.toLocaleString('vi')} đ
                  </Text>
                )}
              </Text>
            </View>
          </View>

          {food.customizes.map((customize) => (
            <View key={customize.id} style={styles.customizeContainer}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>
                {customize.name}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: 'normal' }}>
                (
                {customize.maximumChoices === 1
                  ? 'Chọn tối thiểu 1'
                  : `Chọn tối đa ${customize.maximumChoices}`}
                )
              </Text>
              <View style={styles.horizontalDivider} />
              <View style={{ gap: 16 }}>
                {customize.options.map((option) =>
                  customize.maximumChoices === 1 ? (
                    <View style={styles.optionContainer} key={option.id}>
                      <RadioButton
                        key={option.id}
                        checked={option.isSelected ? option.isSelected : false}
                        label={option.name}
                        onChange={() => onChangeOption(customize.id, option.id)}
                      />
                      <Text>
                        {option.price === 0
                          ? 'Miễn phí'
                          : `+${option.price.toLocaleString('vi')} đ`}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.optionContainer} key={option.id}>
                      <Checkbox
                        key={option.id}
                        checked={option.isSelected ? option.isSelected : false}
                        label={option.name}
                        onChange={() => onChangeOption(customize.id, option.id)}
                      />
                      <Text>
                        {option.price === 0
                          ? 'Miễn phí'
                          : `+${option.price.toLocaleString('vi')} đ`}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          ))}

          <View style={styles.customizeContainer}>
            <Text
              style={{ fontSize: 18, fontWeight: '600', paddingBottom: 10 }}
            >
              Ghi chú cho nhà hàng
            </Text>
            <TextInput
              mode='outlined'
              outlineColor='#e0e0e0'
              activeOutlineColor={'#e0e0e0'}
              theme={{ roundness: 20 }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingHorizontal: 16,
          }}
        >
          <Text style={{ fontWeight: '800' }}>Số lượng: </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <TouchableOpacity onPress={() => onChangeQuantity('DECREASE')}>
              <AntDesign
                name='minuscircleo'
                size={24}
                color={quantity === 1 ? '#bdbdbd' : '#00880c'}
              />
            </TouchableOpacity>
            <Text style={{ fontWeight: '800' }}>{quantity}</Text>
            <TouchableOpacity onPress={() => onChangeQuantity('INCREASE')}>
              <AntDesign name='pluscircleo' size={24} color='#00880c' />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart()}
        >
          <Text style={{ color: '#fff', fontWeight: '800' }}>
            {type === 'EDIT' ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ hàng'}
            {` - ${(total * quantity).toLocaleString('vi')}đ`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CustomizeFood

const width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f9',
    gap: 10,
    marginBottom: 120,
  },
  horizontalDivider: {
    marginVertical: 16,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  foodContainer: {
    flexDirection: 'row',
    elevation: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  foodDetailContainer: {
    padding: 10,
    justifyContent: 'space-between',
    width: width - 180,
  },
  foodImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  foodPrice: { fontSize: 16, fontWeight: '600', color: '#00880c' },
  foodOldPrice: {
    textDecorationLine: 'line-through',
    color: '#494a4a',
    fontSize: 12,
  },
  customizeContainer: {
    elevation: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  option: {
    width: '80%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#00880c',
    padding: 12,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 120,
    elevation: 10,
    // justifyContent: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 8,
  },
})
