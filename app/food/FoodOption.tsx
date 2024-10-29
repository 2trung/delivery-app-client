import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import Checkbox from '@/components/Checkbox'
import RadioButton from '@/components/RadioButton'
import { useState } from 'react'
import { Dimensions } from 'react-native'
import { TextInput } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'

const FoodData = {
  id: '9a0842a9-ee66-4c27-be23-fa98ef000a89',
  name: 'Chanh Đá Xay Chanh Đá Xay Chanh Đá Xay Chanh Đá Xay Chanh Đá Xay',
  image:
    'https://media.be.com.vn/bizops/image/e8e63fb0-5ec5-11ef-adb9-3e6ef01ea27f/resized_thumbnail_w1080_h1080',
  price: 39000,
  oldPrice: 39000,
  orderCount: 0,
  likeCount: 0,
  customizes: [
    {
      id: 'f372c676-0c35-4f46-be7e-8acff09a694a',
      name: 'Chọn size',
      minimumChoices: 1,
      maximumChoices: 1,
      options: [
        {
          id: 'f762ed0b-c519-477e-a61b-42a50b535b0a',
          name: 'Size S',
          price: 0,
          isDefault: false,
          isSelected: false,
        },
        {
          id: 'f6d87bb5-0a80-4049-bfe9-cedba34e53ab',
          name: 'Size M',
          price: 10000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '0274aa62-cf68-4567-bff4-f68c45f1c26f',
          name: 'Size L',
          price: 16000,
          isDefault: false,
          isSelected: false,
        },
      ],
    },
    {
      id: 'd13bdb3f-c070-44a0-90d6-823e54592c57',
      name: 'Bạn dùng thêm bánh ngọt nhé!',
      minimumChoices: 0,
      maximumChoices: 10,
      options: [
        {
          id: '6c9b2689-650b-47ed-b481-6a4732afa4a2',
          name: 'Bánh Su Kem Highlands',
          price: 29000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '6673d2b1-4a13-440b-b23b-5ec3cb0685ec',
          name: 'Bánh Phô Mai Chanh Dây Highlands',
          price: 29000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: 'cabddd88-082a-48e8-af38-7e1eac949c49',
          name: 'Bánh Chuối Highlands',
          price: 29000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '1422741a-a09a-4b53-a60d-c0cb3bd64c31',
          name: 'Bánh Tiramisu Highlands',
          price: 35000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '21d82a2a-321d-4e4e-b3b7-3a2d893341d1',
          name: 'Bánh Phô Mai Caramel Highlands',
          price: 35000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '9165eab3-a367-464b-a3ac-2168e1d8036d',
          name: 'Bánh Phô Mai Trà Xanh Highlands',
          price: 35000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '0d8b3e26-71de-4d63-a01a-f7af8d5c1837',
          name: 'Bánh Mousse Đào Highlands',
          price: 35000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: 'e98fa719-cd4a-4933-be54-36815e854d53',
          name: 'Bánh Mousse Cacao Highlands',
          price: 35000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '9d9453cc-9f74-441c-9bee-d482c2db85c5',
          name: 'Bánh Bông Lan Trứng MuốI',
          price: 39000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '29c42820-f362-4a23-b181-96547e658d4e',
          name: 'Bánh Sữa Chua Phô Mai Highlands',
          price: 39000,
          isDefault: false,
          isSelected: false,
        },
      ],
    },
    {
      id: 'bac397d7-738f-43b5-bd91-776b26392f1c',
      name: 'Bạn dùng thêm bánh mì que nhé!\t',
      minimumChoices: 0,
      maximumChoices: 2,
      options: [
        {
          id: '4230ede8-3931-4398-aa53-dee910604e89',
          name: 'Bánh Mì Que Gà Phô Mai Highlands',
          price: 19000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: '604780c1-867a-475f-b5af-bd04e726a711',
          name: 'Bánh Mì Que Pate Highlands',
          price: 19000,
          isDefault: false,
          isSelected: false,
        },
        {
          id: 'e20cab5f-50f2-4e2b-a5ef-712cd59335de',
          name: 'Bánh Mì Que Bò Xốt Phô Mai Highlands',
          price: 25000,
          isDefault: false,
          isSelected: false,
        },
      ],
    },
  ],
}

const FoodOption = () => {
  const [food, setFood] = useState(FoodData)

  const onChangeOption = (customizeId: string, optionId: string) => {
    const customize = food.customizes.find(
      (customize) => customize.id === customizeId
    )
    if (customize && customize.maximumChoices === 1) {
      setFood((prev) => ({
        ...prev,
        customizes: prev.customizes.map((customize) =>
          customize.id === customizeId
            ? {
                ...customize,
                options: customize.options.map((option) =>
                  option.id === optionId
                    ? { ...option, isSelected: !option.isSelected }
                    : { ...option, isSelected: false }
                ),
              }
            : customize
        ),
      }))
    }
    if (customize && customize.maximumChoices > 1) {
      setFood((prev) => ({
        ...prev,
        customizes: prev.customizes.map((customize) =>
          (customize.id === customizeId &&
            customize.maximumChoices >
              customize.options.filter((option) => option.isSelected).length) ||
          customize.options.find((option) => option.id === optionId)?.isSelected
            ? {
                ...customize,
                options: customize.options.map((option) =>
                  option.id === optionId
                    ? { ...option, isSelected: !option.isSelected }
                    : option
                ),
              }
            : customize
        ),
      }))
    }
  }

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.foodContainer}>
            <Image source={{ uri: FoodData.image }} style={styles.foodImage} />
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
                      <View style={styles.option}>
                        <RadioButton
                          key={option.id}
                          checked={option.isSelected}
                          onChange={() =>
                            onChangeOption(customize.id, option.id)
                          }
                        />
                        <Text style={{ flexShrink: 1, fontWeight: '500' }}>
                          {option.name}
                        </Text>
                      </View>
                      <Text>
                        {option.price === 0
                          ? 'Miễn phí'
                          : `+${option.price.toLocaleString('vi')} đ`}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.optionContainer} key={option.id}>
                      <View style={styles.option}>
                        <Checkbox
                          key={option.id}
                          checked={option.isSelected}
                          onChange={() =>
                            onChangeOption(customize.id, option.id)
                          }
                        />
                        <Text
                          numberOfLines={1}
                          style={{ flexShrink: 1, fontWeight: '500' }}
                        >
                          {option.name}
                        </Text>
                      </View>

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
            paddingHorizontal: 16,
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
            <TouchableOpacity>
              <AntDesign name='minuscircleo' size={24} color='#00880c' />
            </TouchableOpacity>
            <Text style={{ fontWeight: '800' }}>1</Text>
            <TouchableOpacity>
              <AntDesign name='pluscircleo' size={24} color='#00880c' />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>
            Thêm vào giỏ hàng - 50.000đ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default FoodOption

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
    margin: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    height: 120,
    elevation: 10,
    justifyContent: 'center',
    gap: 8,
  },
})
