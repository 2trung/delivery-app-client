import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native'
import MapView, { LatLng, Marker, Polyline } from 'react-native-maps'
import { TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import useDelivery from '@/store/deliverySlice'
import useLocation from '@/store/locationSlice'
import useUser from '@/store/userSlice'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import ChooseWeight from '@/components/ChooseWeight'
import { OrderType, PaymentMethod, ProductCategory, Weight } from '@/types/type'
import ChooseProductCategory from '@/components/ChooseProductCategory'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import PaymentComponent from '@/components/PaymentComponent'
import PaymentMethodBottomSheet from '@/components/PaymentMethodBottomSheet'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getRoute } from '@/api/mapAPI'
import {
  createDeliveryOrder,
  confirmPayment as confirmPaymentAPI,
} from '@/api/orderAPI'
import { Location } from '@/types/type'
import usePaymentMethod from '@/store/paymentMethodSlice'
import { confirmPayment } from '@stripe/stripe-react-native'
import useOrder from '@/store/orderSlice'

const FillDeliveryDetail = () => {
  const router = useRouter()
  const { card } = usePaymentMethod()
  const { setOrder } = useOrder()
  const mapRef = useRef<MapView>(null)
  const {
    locations,
    setLocations,
    swap,
    setWeight,
    weight,
    cod,
    setCod,
    note,
    setNote,
    reset,
    category,
  } = useDelivery()
  const { userLocation } = useLocation()
  const { user } = useUser()
  const [showWeightModal, setShowWeightModal] = useState(false)

  useEffect(() => {
    reset()
    if (user && userLocation) {
      setLocations([
        {
          ...userLocation,
          sequence: 1,
          addressLine1: userLocation.address_line1,
          addressLine2: userLocation.address_line2,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
      ])
    }
  }, [])

  const handleEditLocation = (sequence: number) => {
    router.push({
      pathname: '/delivery/FillAddress',
      params: { sequence },
    })
  }

  const { data: routeData, refetch } = useQuery({
    queryKey: ['route'],
    queryFn: () => {
      return getRoute(
        locations.find((location) => location.sequence === 1) as LatLng,
        locations.find((location) => location.sequence === 2) as LatLng,
        [],
        OrderType.DELIVERY,
        weight ?? Weight.SMALL
      )
    },
    enabled: locations.length === 2,
  })

  const handleCloseWeightModal = (weight: Weight | null) => {
    if (weight) {
      setWeight(weight)
      setShowWeightModal(false)
    } else setShowWeightModal(false)
  }

  useEffect(() => {
    if (locations.length === 2) {
      refetch()
    }
  }, [locations, weight])

  useEffect(() => {
    if (routeData?.path) {
      mapRef.current?.fitToCoordinates(routeData.path)
    }
  }, [routeData])

  const { data, isPending, mutate } = useMutation({
    mutationFn: async () => {
      return createDeliveryOrder({
        locations: locations.map((location) => ({
          latitude: location.latitude,
          longitude: location.longitude,
          addressLine1: location.addressLine1,
          addressLine2: location.addressLine2,
          sequence: location.sequence,
        })) as Location[],
        productSize: weight ?? Weight.SMALL,
        deliveryCost: routeData?.cost ?? 0,
        distance: routeData?.distance ?? 0,
        productCategory: category ?? ProductCategory.OTHER,
        paymentMethod: card ? PaymentMethod.CREDIT_CARD : PaymentMethod.CASH,
        cardId: card ? card.id : '',
        senderName:
          locations.find((location) => location.sequence === 1)?.name ?? '',
        senderPhone:
          locations.find((location) => location.sequence === 1)?.phoneNumber ??
          '',
        receiverName:
          locations.find((location) => location.sequence === 2)?.name ?? '',
        receiverPhone:
          locations.find((location) => location.sequence === 2)?.phoneNumber ??
          '',
        cod,
        note,
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
              setOrder(order)
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
        setOrder(data)
        router.replace({
          pathname: '/order',
          params: { orderId: data.id },
        })
      }
    },

    onError: (error) => {
      Alert.alert('Có lỗi xảy ra')
    },
  })

  const handleCreateDeliveryOrder = () => {
    if (locations.length !== 2)
      return Alert.alert('Vui lòng nhập địa chỉ gửi và nhận hàng')
    if (!weight) return Alert.alert('Vui lòng chọn trọng lượng hàng')
    if (cod && cod > 1000000) return Alert.alert('COD tối đa 1 triệu')
    if (category === null) return Alert.alert('Vui lòng chọn danh mục hàng hoá')
    mutate()
  }
  const [isShowPaymentMethod, setIsShowPaymentMethod] = useState(false)
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor='#000' />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name='arrowleft' size={24} color='#fff' />
          </TouchableOpacity>
          <Text style={styles.title}>Giao hàng</Text>
        </View>
        <ScrollView
          style={{
            paddingHorizontal: 16,
            paddingVertical: 20,
          }}
          contentContainerStyle={{ gap: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Nhap dia chi giao hang */}
          <View style={styles.locationContainer}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => handleEditLocation(1)}
                style={styles.addressContainer}
              >
                <View style={styles.pickupIcon}>
                  <FontAwesome6 name='arrow-up' size={16} color='#fff' />
                </View>
                {locations.find((location) => location.sequence === 1) ? (
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        {
                          locations.find((location) => location.sequence === 1)
                            ?.name
                        }
                      </Text>
                      <View style={styles.phoneNumber}>
                        <Text style={{ color: '#616161' }}>
                          {
                            locations.find(
                              (location) => location.sequence === 1
                            )?.phoneNumber
                          }
                        </Text>
                      </View>
                    </View>

                    <Text numberOfLines={1} style={{ color: '#494b4a' }}>
                      {locations.find((location) => location.sequence === 1)
                        ?.addressLine2 || 'Chưa cập nhật'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.inCompleteAddress}>
                    Nhập thông tin gửi hàng
                  </Text>
                )}
              </TouchableOpacity>
              <View style={styles.horizontalDivider} />
              <TouchableOpacity
                onPress={() => handleEditLocation(2)}
                style={styles.addressContainer}
              >
                <View
                  style={{ ...styles.pickupIcon, backgroundColor: '#ef6300' }}
                >
                  <FontAwesome6 name='arrow-down' size={16} color='#fff' />
                </View>
                {locations.find((location) => location.sequence === 2) ? (
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: '500' }}>
                        {
                          locations.find((location) => location.sequence === 2)
                            ?.name
                        }
                      </Text>
                      <View style={styles.phoneNumber}>
                        <Text style={{ color: '#616161' }}>
                          {
                            locations.find(
                              (location) => location.sequence === 2
                            )?.phoneNumber
                          }
                        </Text>
                      </View>
                    </View>

                    <Text numberOfLines={1} style={{ color: '#494b4a' }}>
                      {locations.find((location) => location.sequence === 2)
                        ?.addressLine2 || 'Chưa cập nhật'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.inCompleteAddress}>
                    Nhập thông tin nhận hàng
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Pressable style={styles.swapButton} onPress={() => swap()}>
              <AntDesign
                name='swap'
                size={24}
                color='#484848'
                style={{ transform: [{ rotate: '90deg' }] }}
              />
              {/* <AntDesign name='retweet' size={24} color='black' /> */}
            </Pressable>
          </View>

          <Pressable
            onPress={() => setShowWeightModal(true)}
            style={{
              ...styles.productType,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <MaterialCommunityIcons
                name='weight-kilogram'
                size={24}
                color='#00880C'
              />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Trọng lượng hàng <Text style={{ color: 'red' }}>*</Text>
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {weight === Weight.SMALL && '< 5KG'}
                {weight === Weight.MEDIUM && '< 20KG'}
                {weight === Weight.LARGE && '< 100KG'}
              </Text>
              <Ionicons name='chevron-forward' size={18} color='#494b4a' />
            </View>
          </Pressable>

          <ChooseProductCategory />

          <View
            style={{
              ...styles.productType,
              gap: 30,
            }}
          >
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Đơn hàng COD?
              </Text>
              <TextInput
                mode='outlined'
                placeholder='Tối đa 1 triệu'
                // style={{ backgroundColor: '#fff' }}
                keyboardType='number-pad'
                outlineColor='#E8E8E8'
                activeOutlineColor='#00880C'
                theme={{ roundness: 20 }}
                placeholderTextColor={'#8E8E8E'}
                // value={cod.toString()}
                onChangeText={(text) => setCod(parseInt(text))}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Lưu ý giao hàng
              </Text>
              <TextInput
                mode='outlined'
                placeholder='Vd: Gọi trước khi giao hàng'
                outlineColor='#E8E8E8'
                activeOutlineColor='#00880C'
                theme={{ roundness: 20 }}
                placeholderTextColor={'#8E8E8E'}
                selectionColor='#00880C'
                // value={note}
                onChangeText={(text) => setNote(text)}
              />
            </View>
          </View>

          <View style={styles.mapContainer}>
            <Text style={styles.distance}>
              Tổng quãng đường:{' '}
              <Text style={{ color: '#000', fontWeight: '400' }}>
                {routeData?.distance.toFixed(2) ?? 0} km
              </Text>
            </Text>
            <View style={{ borderRadius: 10, overflow: 'hidden' }}>
              <MapView
                ref={mapRef}
                style={{ height: 150, borderRadius: 10 }}
                scrollEnabled={false}
                zoomEnabled={false}
                initialRegion={{
                  latitude: 21.028511,
                  longitude: 105.804817,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {routeData?.path && (
                  <Polyline
                    coordinates={routeData.path}
                    strokeColor='#00aa13'
                    strokeWidth={4}
                    geodesic
                  />
                )}
                {locations.map((location, index) => (
                  <Marker
                    key={index}
                    coordinate={location}
                    title={location.name}
                    description={location.addressLine1}
                  >
                    <MaterialIcons
                      name='location-on'
                      size={24}
                      color={location.sequence === 1 ? '#009112' : '#ef6300'}
                    />
                  </Marker>
                ))}
              </MapView>
            </View>
          </View>
        </ScrollView>
        {showWeightModal && (
          <ChooseWeight handleCloseWeightModal={handleCloseWeightModal} />
        )}
      </SafeAreaView>
      <View
        style={{
          padding: 16,
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontWeight: '600', fontSize: 16 }}>Tổng:</Text>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>
          {routeData?.cost.toLocaleString('vi') ?? 0} đ
        </Text>
      </View>
      <PaymentComponent
        buttonTitle='Đặt giao hàng'
        isPending={isPending}
        onSetPaymentMethod={() => setIsShowPaymentMethod(true)}
        onConfirm={() => {
          handleCreateDeliveryOrder()
        }}
      />
      {isShowPaymentMethod && (
        <PaymentMethodBottomSheet
          onClose={() => setIsShowPaymentMethod(false)}
        />
      )}
    </GestureHandlerRootView>
  )
}

export default FillDeliveryDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  horizontalDivider: {
    borderBottomWidth: 1,
    marginVertical: 16,
    borderColor: '#F0EFEF',
    // borderStyle: 'dashed',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'flex-end',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#00880C',
    alignItems: 'center',
    padding: 16,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '500' },
  locationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  swapButton: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#f1f2f4',
    alignSelf: 'center',
  },
  pickupIcon: {
    height: 24,
    width: 24,
    backgroundColor: '#009112',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  phoneNumber: {
    backgroundColor: '#f1f2f4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 40,
  },
  inCompleteAddress: {
    color: '#c3c3c3',
    fontSize: 16,
    fontWeight: '500',
  },
  productType: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 16,
  },

  buttonTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  buttonContainer: {
    width: '100%',
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    padding: 16,
    backgroundColor: '#fff',
    elevation: 20,
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
  mapContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 16,
  },
  distance: {
    paddingTop: 8,
    alignSelf: 'center',
    color: '#494b4a',
    fontWeight: '300',
  },
})
