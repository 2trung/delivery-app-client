import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import {
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native'
import { images, icons } from '../constants'
import {
  LocationDetail,
  LocationType,
  OrderType,
  ProductCategory,
  Route,
} from '@/types/type'
import { ScrollView } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import useOrder from '@/store/orderSlice'
import React from 'react'
import { cancelOrder } from '@/api/orderAPI'
import { useRouter } from 'expo-router'
import { useMutation } from '@tanstack/react-query'

const SearchingDriverBottomSheet = () => {
  const router = useRouter()
  const destinationPin = [
    icons.destinationPin1,
    icons.destinationPin2,
    icons.destinationPin3,
  ]
  const [dots, setDots] = useState(0)
  const { order, setOrder } = useOrder()

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const showAlert = () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Thông báo',
        'Bạn chắc chắn muốn huỷ đơn hàng chứ?',
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
              cancelOrderMutate()
            },
          },
        ],
        { cancelable: false }
      )
    })
  }
  const { isPending: cancelPending, mutate: cancelOrderMutate } = useMutation({
    mutationFn: () => {
      if (order) {
        return cancelOrder(order.id)
      }
      return Promise.reject(new Error('Không tìm thấy đơn hàng'))
    },
    onSuccess: (data) => {
      ToastAndroid.show('Huỷ đơn hàng thành công', ToastAndroid.LONG)
      router.replace('/(tabs)/Home')
    },
    onError: (error) => {
      console.log(error)
      ToastAndroid.show('Không thể huỷ đơn hàng', ToastAndroid.LONG)
    },
  })

  const loadingText = 'Đang tìm tài xế' + '.'.repeat(dots)
  return (
    <BottomSheet snapPoints={[110]} enablePanDownToClose={false} index={0}>
      <BottomSheetView collapsable={false} style={styles.contentContainer}>
        <View style={styles.orderSatatusContainer}>
          <Image
            source={images.rideOderBike}
            style={{ height: 50, width: 50, resizeMode: 'contain' }}
          />
          <Text style={{ fontSize: 16, fontWeight: '500' }}>{loadingText}</Text>
        </View>
        <View style={styles.tripLocationsContainer}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <View style={{ gap: 10 }}>
              <View style={styles.addressContainer}>
                {order?.orderType === OrderType.FOOD_DELIVERY ? (
                  <Image
                    source={icons.restaurantPin}
                    style={{ height: 28, width: 24 }}
                  />
                ) : (
                  <FontAwesome
                    name='arrow-circle-up'
                    size={28}
                    color='#009112'
                  />
                )}

                <View>
                  <Text style={styles.address1} numberOfLines={1}>
                    {order?.locations.find(
                      (location) => location.sequence === 1
                    )?.addressLine1 ?? 'Vị trí của bạn'}
                  </Text>
                  <Text style={styles.address2} numberOfLines={2}>
                    {
                      order?.locations.find(
                        (location) => location.sequence === 1
                      )?.addressLine2
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.addressContainer}>
                {order?.locations.length === 2 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      width: '95%',
                      alignItems: 'center',
                    }}
                  >
                    <View style={styles.iconContainer}>
                      <MaterialIcons
                        name='location-on'
                        size={16}
                        color='#fff'
                      />
                    </View>
                    <View>
                      <Text style={styles.address1} numberOfLines={1}>
                        {
                          order?.locations.find(
                            (location) => location.sequence === 2
                          )?.addressLine1
                        }
                      </Text>
                      <Text style={styles.address2} numberOfLines={2}>
                        {
                          order?.locations.find(
                            (location) => location.sequence === 2
                          )?.addressLine2
                        }
                      </Text>
                    </View>
                  </View>
                ) : (
                  order?.locations
                    .filter((l) => l.sequence !== 1)
                    .map((location, index) => (
                      <View key={index} style={styles.addressContainer}>
                        <View style={styles.iconContainer}>
                          <Image
                            source={destinationPin[location.sequence - 1]}
                            style={{
                              height: 16,
                              width: 16,
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View style={{ height: 60 }}>
                          <Text style={styles.address1} numberOfLines={1}>
                            {location.addressLine1}
                          </Text>
                          <Text style={styles.address2} numberOfLines={2}>
                            {location.addressLine1}
                          </Text>
                        </View>
                      </View>
                    ))
                )}
              </View>
            </View>
          </View>
          <View style={styles.horizontalDivider} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {order?.paymentMethod === 'CASH' ? (
                <MaterialCommunityIcons
                  name='cash-multiple'
                  size={24}
                  color='#0aafd9'
                />
              ) : (
                <FontAwesome name='credit-card-alt' size={24} color='#0aafd9' />
              )}

              <Text style={{ fontWeight: '500' }}>
                {order?.paymentMethod === 'CASH'
                  ? 'Tiền mặt'
                  : 'Thẻ tín dụng/ghi nợ'}
              </Text>
            </View>
            <Text style={{ fontWeight: '500' }}>
              {order?.cost.toLocaleString('vi')}đ
            </Text>
          </View>
        </View>
        {order?.orderType === OrderType.FOOD_DELIVERY && (
          <View style={styles.tripLocationsContainer}>
            <Text
              style={{ fontWeight: '600', paddingBottom: 20, fontSize: 16 }}
            >
              Chi tiết đơn hàng
            </Text>
            <View style={{ gap: 10 }}>
              {order?.foodOrderItems?.map((item, index) => (
                <View key={index}>
                  <View style={styles.locationContainer}>
                    <Text style={{ fontWeight: '500' }}>
                      {item.quantity} x {item.food.name}
                    </Text>
                  </View>
                  {item.foodOrderItemCustomizes.map((customize, index) => (
                    <View key={index}>
                      <Text style={{ fontWeight: '500', color: '#646363' }}>
                        {customize.name}
                        {': '}
                        {customize.foodOrderItemCustomizeOptions.map(
                          (option, index, array) => (
                            <React.Fragment key={index}>
                              <Text style={{ color: '#646363' }}>
                                {option.name}
                              </Text>
                              {index < array.length - 1 && ', '}
                            </React.Fragment>
                          )
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}
        {order?.orderType === OrderType.DELIVERY && (
          <View style={styles.tripLocationsContainer}>
            <Text
              style={{ fontWeight: '600', paddingBottom: 20, fontSize: 16 }}
            >
              Chi tiết đơn hàng
            </Text>
            <View
              style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}
            >
              <Entypo name='box' size={20} color='black' />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {order?.deliveryOrderDetail?.productCategory ===
                ProductCategory.BOOK
                  ? 'Sách'
                  : order?.deliveryOrderDetail?.productCategory ===
                    ProductCategory.CLOTHING
                  ? 'Quần áo'
                  : order?.deliveryOrderDetail?.productCategory ===
                    ProductCategory.DOCUMENT
                  ? 'Tài liệu'
                  : order?.deliveryOrderDetail?.productCategory ===
                    ProductCategory.FOOD
                  ? 'Đồ ăn'
                  : order?.deliveryOrderDetail?.productCategory ===
                    ProductCategory.PHARMACY
                  ? 'Thuốc'
                  : 'Khác'}
              </Text>
            </View>
            <Text style={{ paddingTop: 10 }}>
              Ghi chú: {order?.deliveryOrderDetail?.note}
            </Text>
            <View style={styles.horizontalDivider} />
            <View
              style={{
                gap: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontWeight: '600' }}>COD:</Text>
              <Text style={{ fontWeight: '600' }}>
                {order?.deliveryOrderDetail?.cod} đ
              </Text>
            </View>
          </View>
        )}
        <Pressable style={styles.cancelButton} onPress={() => showAlert()}>
          <Text style={{ color: '#a80a18', fontSize: 16, fontWeight: '600' }}>
            {cancelPending ? (
              <ActivityIndicator
                size='small'
                color='#a80a18'
                style={{ paddingVertical: 2 }}
              />
            ) : (
              'Huỷ chuyến'
            )}
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  )
}

export default SearchingDriverBottomSheet

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    // width: '100%',
    // height: '50%',
    gap: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  address1: { fontSize: 16, fontWeight: 'bold' },
  address2: { fontSize: 14, color: '#646464' },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F96B00',
    paddingVertical: 4,
    borderRadius: 100,
    width: 24,
    height: 24,
  },
  orderSatatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#fef0ef',
    paddingVertical: 15,
    borderRadius: 30,
  },
  tripLocationsContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '95%',
  },
  horizontalDivider: {
    borderBottomWidth: 1,
    marginVertical: 16,
    borderColor: '#F0EFEF',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '90%',
  },
})
function clearOrder() {
  throw new Error('Function not implemented.')
}
