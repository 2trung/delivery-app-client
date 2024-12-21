import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native'
import useCartStore from '@/store/cartSlice'
import useLocation from '@/store/locationSlice'
import useFood from '@/store/foodSlice'
import { router } from 'expo-router'
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getRoute } from '@/api/mapAPI'
import {
  FoodWithQuantity,
  LocationDetail,
  OrderType,
  PaymentMethod,
} from '@/types/type'
import { LatLng } from 'react-native-maps'
import SearchAddressModal from '@/components/SearchAddressModal'
import PaymentMethodBottomSheet from '@/components/PaymentMethodBottomSheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import PaymentComponent from '@/components/PaymentComponent'
import {
  createFoodOrder,
  confirmPayment as confirmPaymentAPI,
} from '@/api/orderAPI'
import { useRouter } from 'expo-router'
import usePaymentMethod from '@/store/paymentMethodSlice'
import { confirmPayment } from '@stripe/stripe-react-native'
import useOrder from '@/store/orderSlice'

const Cart = () => {
  const router = useRouter()
  const { card } = usePaymentMethod()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isShowPaymentMethod, setIsShowPaymentMethod] = useState(false)
  const {
    restaurant,
    foods,
    onChangeQuantity,
    setOriginAddress,
    originAddress,
    clearCart,
  } = useCartStore()
  const { setEditingFood } = useFood()
  const { userLocation } = useLocation()
  const { setOrder } = useOrder()
  const handleOnChangeQuamtity = (
    food: FoodWithQuantity,
    type: 'INCREASE' | 'DECREASE'
  ) => {
    if (foods.length === 0) router.back()
    else onChangeQuantity(food, type)
  }
  useEffect(() => {
    setOriginAddress(userLocation)
  }, [])

  const { data: routeData, refetch } = useQuery({
    queryKey: ['route'],
    queryFn: () => {
      return getRoute(
        {
          latitude: restaurant?.latitude ?? 0,
          longitude: restaurant?.longitude ?? 0,
        },
        originAddress as LatLng,
        [],
        OrderType.FOOD_DELIVERY
      )
    },
    enabled: !!originAddress && !!restaurant,
  })
  const { data, isPending, mutate } = useMutation({
    mutationFn: () => {
      return createFoodOrder({
        deliveryLocation: {
          latitude: originAddress?.latitude ?? 0,
          longitude: originAddress?.longitude ?? 0,
          addressLine1: originAddress?.address_line1 ?? '',
          addressLine2: originAddress?.address_line2 ?? '',
        },
        totalDeliveryCost: routeData?.cost ?? 0,
        totalFoodCost: foods.reduce(
          (acc, food) => acc + food.total * food.quantity,
          0
        ),
        paymentMethod: card ? PaymentMethod.CREDIT_CARD : PaymentMethod.CASH,
        cardId: card?.id ?? '',
        restaurantId: restaurant?.id ?? '',
        foodOrderItems: foods.map((food) => ({
          id: food.id,
          quantity: food.quantity,
          note: '',
          customizes: food.customizes.map((customize) => ({
            id: customize.id,
            optionIds: customize.options
              .filter((option) => option.isSelected)
              .map((option) => option.id),
          })),
        })),
      })
    },
    onSuccess: async (data) => {
      if (data?.clientSecret) {
        const { paymentIntent, error } = await confirmPayment(data.clientSecret)
        if (error) {
          Alert.alert('Thanh toán thất bại', error.message)
        } else if (paymentIntent) {
          if (paymentIntent.status === 'Succeeded') {
            const order = await confirmPaymentAPI(data.id)
            if (order) {
              clearCart()
              setOrder(data)
              router.replace({
                pathname: '/order',
                params: { orderId: data.id },
              })
            } else Alert.alert('Không thể xác nhận thanh toán')
          } else {
            Alert.alert('Không thể xác nhận thanh toán')
          }
        }
      } else {
        clearCart()
        setOrder(data)
        router.replace({
          pathname: '/order',
          params: { orderId: data.id },
        })
      }
    },
    onError: (error) => {
      console.log(error)
      Alert.alert('Đặt hàng thất bại')
    },
  })

  useEffect(() => {
    refetch()
  }, [originAddress])

  const setAddresses = (location: any) => {
    setOriginAddress({
      latitude: location.lat,
      longitude: location.lon,
      address_line1: location.address_line1,
      address_line2: location.address_line2,
    })
    setIsModalVisible(false)
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {isModalVisible && (
          <SearchAddressModal
            setAddresses={setAddresses}
            onClose={() => setIsModalVisible(false)}
          />
        )}
        <StatusBar backgroundColor='#757575' />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='chevron-back' size={24} color='black' />
          </TouchableOpacity>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {restaurant?.name}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 8 }}
          contentContainerStyle={{ gap: 10, flexGrow: 1 }}
        >
          <View style={styles.addressContainer}>
            <View style={styles.addressLine1Container}>
              <View style={{ gap: 8 }}>
                <Text style={styles.addressTitle}>Địa chỉ giao hàng</Text>
                <Text style={styles.addressLine1}>
                  {originAddress?.address_line1}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editAddressButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.editAddressButtonTitle}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 16 }} numberOfLines={2}>
              {originAddress?.address_line2}
            </Text>
          </View>
          <View style={{ backgroundColor: '#fff' }}>
            {foods.map((food, index) => (
              <View style={styles.foodContainer} key={index}>
                <View style={styles.foodDetailContainer}>
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View>
                      <Text style={styles.foodName} numberOfLines={2}>
                        {food.name}
                      </Text>
                      {food.customizes.map(
                        (customize) =>
                          customize.options.some(
                            (option) => option.isSelected
                          ) && (
                            <View key={customize.id}>
                              <Text style={styles.customizeName}>
                                {customize.name}
                                {': '}
                                {customize.options
                                  .filter((option) => option.isSelected)
                                  .map((option, index, array) => (
                                    <React.Fragment key={option.id}>
                                      <Text style={styles.optionName}>
                                        {option.name}
                                      </Text>
                                      {index < array.length - 1 && ', '}
                                    </React.Fragment>
                                  ))}
                              </Text>
                            </View>
                          )
                      )}
                    </View>
                    <Text
                      style={{ fontSize: 16, fontWeight: '500', paddingTop: 8 }}
                    >
                      {food.total.toLocaleString('vi')} đ
                    </Text>
                  </View>
                  <Image
                    source={{ uri: food.image }}
                    style={styles.foodImage}
                  />
                </View>
                <View>
                  <View style={styles.foodPriceContainer}>
                    <TouchableOpacity
                      style={styles.editFoodButton}
                      onPress={() => {
                        setEditingFood(food, 'EDIT')
                        router.push({
                          pathname: '/food/(modal)/CustomizeFood',
                        })
                      }}
                    >
                      <FontAwesome name='pencil' size={16} color='black' />
                      <Text style={{ fontWeight: '600' }}>Tuỳ chỉnh</Text>
                    </TouchableOpacity>
                    <View style={styles.changeQuantityContainer}>
                      <TouchableOpacity
                        onPress={() => handleOnChangeQuamtity(food, 'DECREASE')}
                      >
                        <AntDesign
                          name='minuscircleo'
                          size={24}
                          color={'#00880c'}
                        />
                      </TouchableOpacity>
                      <Text style={{ fontWeight: '800' }}>{food.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => handleOnChangeQuamtity(food, 'INCREASE')}
                      >
                        <AntDesign
                          name='pluscircleo'
                          size={24}
                          color='#00880c'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.horizontalDivider} />
              </View>
            ))}

            <View style={styles.addMoreFoodContainer}>
              <View>
                <Text style={{ fontWeight: '600' }}>
                  Bạn cần thêm gì nữa không?
                </Text>
                <Text>Chọn thêm món khác nếu bạn muốn</Text>
              </View>
              <TouchableOpacity
                style={styles.editAddressButton}
                onPress={() =>
                  router.replace({
                    pathname: '/food/Restaurant',
                    params: { id: restaurant?.id },
                  })
                }
              >
                <Text style={styles.editAddressButtonTitle}>Thêm món</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paymentDetailContainer}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Tóm tắt thanh toán
              </Text>
              <View style={styles.paymentDetail}>
                <View style={styles.paymentLine}>
                  <Text style={{ fontWeight: '400' }}>Giá tiền:</Text>
                  <Text>
                    {foods
                      .reduce(
                        (acc, food) => acc + food.total * food.quantity,
                        0
                      )
                      .toLocaleString('vi')}{' '}
                    đ
                  </Text>
                </View>
                <View style={styles.paymentLine}>
                  <Text>{`Phí giao hàng (${routeData?.distance.toFixed(
                    2
                  )}km):`}</Text>
                  <Text>{routeData?.cost.toLocaleString('vi')} đ</Text>
                </View>
                <View style={styles.horizontalDivider} />
                <View style={styles.paymentLine}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    Tổng thanh toán:
                  </Text>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {(
                      foods.reduce(
                        (acc, food) => acc + food.total * food.quantity,
                        0
                      ) + (routeData?.cost ?? 0)
                    ).toLocaleString('vi')}{' '}
                    đ
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <PaymentComponent
          buttonTitle='Đặt giao món'
          isPending={isPending}
          onSetPaymentMethod={() => setIsShowPaymentMethod(true)}
          onConfirm={mutate}
        />
        {isShowPaymentMethod && (
          <PaymentMethodBottomSheet
            onClose={() => setIsShowPaymentMethod(false)}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Cart

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  addressContainer: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 10,
  },
  addressLine1Container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  addressLine1: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressTitle: {
    color: '#2F2828',
    fontWeight: '500',
  },
  editAddressButton: {
    padding: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#00880c',
    borderRadius: 100,
  },
  editAddressButtonTitle: { color: '#00880c', fontWeight: '600' },
  foodContainer: {
    backgroundColor: '#fff',
    padding: 16,
    gap: 20,
  },
  foodDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  customizeName: {
    fontWeight: '500',
    flex: 1,
    lineHeight: 24,
  },
  optionName: { fontWeight: '300', color: '#2F2828' },
  foodImage: { width: 100, height: 100, borderRadius: 20 },
  foodPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    justifyContent: 'space-between',
  },
  changeQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addMoreFoodContainer: {
    flexDirection: 'row',
    // paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    gap: 10,
    backgroundColor: '#fff',
  },
  paymentDetailContainer: {
    padding: 16,
    backgroundColor: '#fff',
    gap: 16,
  },
  paymentDetail: {
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F0EFEF',
    borderRadius: 10,
    gap: 10,
  },
  paymentLine: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  horizontalDivider: {
    borderBottomWidth: 1.5,
    marginVertical: 8,
    borderColor: '#F0EFEF',
    backgroundColor: '#fff',
  },
  additionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
    marginVertical: 5,
  },
  confirmButton: {
    backgroundColor: '#009112',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editFoodButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#F0EFEF',
    borderRadius: 100,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
})
