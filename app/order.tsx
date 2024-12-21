import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MapView, { LatLng, Marker, Polyline } from 'react-native-maps'
import { icons } from '../constants'
import { customMapStyle } from '../utils/mapStyle'
import { OrderStatus, OrderType } from '@/types/type'
import { useQuery } from '@tanstack/react-query'
import { getOrderDetail } from '@/api/orderAPI'
import BackButton from '@/components/BackButton'
import useOrder from '@/store/orderSlice'
import SearchingDriverBottomSheet from '@/components/SearchingDriverBottomSheet'
import OrderInProgressBottomSheet from '@/components/OrderInProgressBottomSheet'
import ReviewModal from '@/components/ReviewModal'
import { getRoute } from '@/api/mapAPI'
import stompClient from '@/utils/stompClient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'

const Order = () => {
  const { setOrder, order, clearOrder } = useOrder()
  const router = useRouter()
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const mapRef = useRef<MapView>(null)
  const destinationPin = [
    icons.destinationPin1,
    icons.destinationPin2,
    icons.destinationPin3,
  ]
  useEffect(() => {
    stompClient.activate()
    stompClient.onConnect = () => {
      stompClient.subscribe('/topic/order/' + order?.id, (message) => {
        const byteArray = new Uint8Array(message.binaryBody)
        const decoder = new TextDecoder('utf-8')
        const decodedMessage = decoder.decode(byteArray).replace(/^"|"$/g, '')
        if (decodedMessage === OrderStatus.CANCELED) {
          router.replace('/(tabs)/Home')
          ToastAndroid.show('Đơn hàng đã bị hủy', ToastAndroid.LONG)
        }
        refetch()
      })
    }
    return () => {
      stompClient.deactivate()
    }
  }, [order])

  const { data: routeData } = useQuery({
    queryKey: ['route'],
    queryFn: () => {
      return getRoute(
        order?.locations.find((location) => location.sequence === 1) as LatLng,
        order?.locations.find((location) => location.sequence === 2) as LatLng,
        order?.locations.filter(
          (location) => location.sequence !== 1 && location.sequence !== 2
        ) as LatLng[],
        order?.orderType as OrderType
      )
    },
    enabled: !!order,
  })
  useEffect(() => {
    if (routeData?.path) {
      mapRef.current?.fitToCoordinates(routeData.path, {
        edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
      })
    }
  }, [routeData])

  const {
    data: orderDetail,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['order'],
    queryFn: () => {
      return getOrderDetail(orderId)
    },
    enabled: true,
  })
  useEffect(() => {
    if (orderDetail) {
      setOrder(orderDetail)
    }
  }, [orderDetail])

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            clearOrder()
            router.replace('/(tabs)/Home')
          }}
          style={styles.backButton}
        >
          <AntDesign name='arrowleft' size={24} color='black' />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        animationType='fade'
        statusBarTranslucent
        visible={isLoading}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={'#00880C'} size={'large'} />
        </View>
      </Modal>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        showsCompass={false}
        //   initialRegion={{
        //     latitude: userLocation.latitude,
        //     longitude: userLocation.longitude,
        //     latitudeDelta: 0.01,
        //     longitudeDelta: 0.01,
        //   }}
        // showsUserLocation
      >
        {/* Vị trí điểm đi */}
        {order?.locations && (
          <Marker
            coordinate={
              order.locations.find(
                (location) => location.sequence === 1
              ) as LatLng
            }
          >
            {order.orderType === OrderType.FOOD_DELIVERY ? (
              <Image
                source={icons.restaurantPin}
                style={{ height: 28, width: 24 }}
              />
            ) : (
              <Image
                source={icons.originPin}
                style={styles.customImageMarker}
              />
            )}
          </Marker>
        )}
        {/* Vị trí điểm đến */}
        {order?.locations?.length === 2 && (
          <Marker
            coordinate={
              order?.locations.find(
                (location) => location.sequence === 2
              ) as LatLng
            }
          >
            <Image
              source={icons.destinationPin}
              style={styles.customImageMarker}
            />
          </Marker>
        )}

        {/* Vị trí tài xế */}
        {order?.driver &&
          order.status !== OrderStatus.WAITING_FOR_ACCEPTANCE &&
          order.status !== OrderStatus.PENDING && (
            <Marker
              coordinate={{
                latitude: order.driver.latitude,
                longitude: order.driver.longitude,
              }}
            >
              <Image
                source={icons.motorBike}
                style={{ width: 30, height: 50 }}
                resizeMode='contain'
              />
            </Marker>
          )}
        {/* Vị trí điểm đến nhiều điểm */}
        {order?.locations &&
          order.locations.length > 2 &&
          order?.locations
            .filter((item) => item.sequence !== 1)
            .map((item, index) => (
              <Marker key={index} coordinate={item as LatLng}>
                <Image
                  source={destinationPin[item.sequence - 1]}
                  style={styles.customImageMarker}
                />
              </Marker>
            ))}
        {/* Đường đi */}
        {routeData?.path && (
          <Polyline
            coordinates={routeData.path}
            strokeColor='#00aa13'
            strokeWidth={4}
            geodesic
          />
        )}
      </MapView>

      {(order?.status === OrderStatus.PENDING ||
        order?.status === OrderStatus.WAITING_FOR_ACCEPTANCE) && (
        <SearchingDriverBottomSheet />
      )}
      {(order?.status === OrderStatus.ARRIVING ||
        order?.status === OrderStatus.IN_PROGRESS) && (
        <OrderInProgressBottomSheet />
      )}
      {order?.status === OrderStatus.COMPLETED && <ReviewModal />}
    </GestureHandlerRootView>
  )
}

export default Order
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '100%',
  },
  customImageMarker: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
  contentContainer: {
    paddingHorizontal: 16,
    width: '100%',
    height: '50%',
  },
  horizontalDivider: {
    height: 35,
    left: 12,
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    marginBottom: 5,
    width: '100%',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F96B00',
    paddingVertical: 4,
    borderRadius: 100,
    width: 24,
    height: 24,
  },
  tripEstimateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  tripEstimate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#646464',
  },
  confirmButton: {
    backgroundColor: '#009112',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripTotal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  additionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
    marginVertical: 5,
  },
  address1: { fontSize: 16, fontWeight: 'bold' },
  address2: { fontSize: 14, color: '#646464' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonContainer: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
  backButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 100,
    elevation: 10,
  },
})
