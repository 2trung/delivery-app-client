import { ProductCategory } from '@/types/type'
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import useDeliveryStore from '@/store/deliverySlice'
const ChooseProductCategory = () => {
  const { category, setCategory } = useDeliveryStore()
  return (
    <View style={styles.productType}>
      <Text style={{ fontSize: 16, fontWeight: '500' }}>
        Danh mục hàng hoá <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 10 }}>
        <Pressable
          style={
            category === ProductCategory.FOOD
              ? styles.productTypeContainerActive
              : styles.productTypeContainer
          }
          onPress={() => setCategory(ProductCategory.FOOD)}
        >
          <FontAwesome6
            name='bowl-food'
            size={16}
            color={category === ProductCategory.FOOD ? '#00880C' : '#494b4a'}
          />
          <Text style={{ color: '#494b4a' }}>Đồ ăn</Text>
        </Pressable>
        <Pressable
          style={
            category === ProductCategory.CLOTHING
              ? styles.productTypeContainerActive
              : styles.productTypeContainer
          }
          onPress={() => setCategory(ProductCategory.CLOTHING)}
        >
          <Ionicons
            name='shirt'
            size={16}
            color={
              category === ProductCategory.CLOTHING ? '#00880C' : '#494b4a'
            }
          />
          <Text style={{ color: '#494b4a' }}>Quần áo</Text>
        </Pressable>
        <Pressable
          style={
            category === ProductCategory.DOCUMENT
              ? styles.productTypeContainerActive
              : styles.productTypeContainer
          }
          onPress={() => setCategory(ProductCategory.DOCUMENT)}
        >
          <Ionicons
            name='document-text'
            size={16}
            color={
              category === ProductCategory.DOCUMENT ? '#00880C' : '#494b4a'
            }
          />
          <Text style={{ color: '#494b4a' }}>Tài liệu</Text>
        </Pressable>
        <Pressable
          style={
            category === ProductCategory.PHARMACY
              ? styles.productTypeContainerActive
              : styles.productTypeContainer
          }
          onPress={() => setCategory(ProductCategory.PHARMACY)}
        >
          <FontAwesome6
            name='briefcase-medical'
            size={16}
            color={
              category === ProductCategory.PHARMACY ? '#00880C' : '#494b4a'
            }
          />
          <Text style={{ color: '#494b4a' }}>Thuốc</Text>
        </Pressable>
        <Pressable
          style={
            category === ProductCategory.BOOK
              ? styles.productTypeContainerActive
              : styles.productTypeContainer
          }
          onPress={() => setCategory(ProductCategory.BOOK)}
        >
          <FontAwesome6
            name='book'
            size={16}
            color={category === ProductCategory.BOOK ? '#00880C' : '#494b4a'}
          />
          <Text style={{ color: '#494b4a' }}>Sách</Text>
        </Pressable>
        <Pressable
          style={
            category === ProductCategory.OTHER
              ? styles.productTypeContainerActive
              : styles.productTypeContainer
          }
          onPress={() => setCategory(ProductCategory.OTHER)}
        >
          <MaterialCommunityIcons
            name='dots-vertical-circle'
            size={16}
            color={category === ProductCategory.OTHER ? '#00880C' : '#494b4a'}
          />
          <Text style={{ color: '#494b4a' }}>Khác</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default ChooseProductCategory

const styles = StyleSheet.create({
  productTypeContainer: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: '#f7f7f7',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  productTypeContainerActive: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: '#E0FBD2',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#00880C',
  },
  productType: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 16,
  },
})
