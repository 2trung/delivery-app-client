import MapView, { Polyline, Marker, LatLng } from 'react-native-maps'
import useLocation from '@/store/locationSlice'
import { StyleSheet, Image, ToastAndroid, Alert } from 'react-native'
import { customMapStyle } from '@/utils/mapStyle'
import { getRoute, reverse } from '@/api/mapAPI'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import BackButton from '@/components/BackButton'
import { icons } from '@/constants'
import {
  createRideOrder,
  confirmPayment as confirmPaymentAPI,
} from '@/api/orderAPI'
import RideOrderDetailBottomSheet from '@/components/RideOrderDetailBottomSheet'
import stompClient from '@/utils/stompClient'
import { OrderType, PaymentMethod } from '@/types/type'
import useOrder from '@/store/orderSlice'
import { StatusBar } from 'expo-status-bar'
import { useStripe } from '@stripe/stripe-react-native'
import usePaymentMethod from '@/store/paymentMethodSlice'

const Maps = () => {
  const router = useRouter()
  const { confirmPayment } = useStripe()
  const { card } = usePaymentMethod()
  const {
    origin,
    destination,
    userLocation,
    setUserLocation,
    removeDestinations,
  } = useLocation()
  const { setOrder } = useOrder()
  const mapRef = useRef<MapView>(null)
  const { data: routeData } = useQuery({
    queryKey: ['route'],
    queryFn: () => {
      return getRoute(
        origin ?? (userLocation as LatLng),
        destination[destination.length - 1] as LatLng,
        destination.slice(0, -1) as LatLng[],
        OrderType.RIDE
      )
    },
    enabled: (!!origin || !!userLocation) && !!destination,
  })

  useEffect(() => {
    if (routeData?.path) {
      mapRef.current?.fitToCoordinates(routeData.path, {
        edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
      })
    }
  }, [routeData])

  const destinationPin = [
    icons.destinationPin1,
    icons.destinationPin2,
    icons.destinationPin3,
  ]

  useEffect(() => {
    const getLocation = async () => {
      const location = await reverse(userLocation)
      setUserLocation({
        address_line1: location?.results[0]?.address_line1,
        address_line2: location?.results[0]?.address_line2,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      })
    }
    if (!origin) getLocation()
  }, [origin])
  const { isPending, mutate: handleCreateOrder } = useMutation({
    mutationFn: async () => {
      if (!routeData) return Promise.reject('No route data available')
      let locations = []

      locations.push({
        addressLine1: origin?.address_line1 ?? userLocation.address_line1,
        addressLine2: origin?.address_line2 ?? userLocation.address_line2,
        latitude: origin?.latitude ?? userLocation.latitude,
        longitude: origin?.longitude ?? userLocation.longitude,
        locationType: 'PICKUP',
        sequence: 1,
      })
      for (let i = 0; i < destination.length; i++) {
        locations.push({
          addressLine1: destination[i]?.address_line1,
          addressLine2: destination[i]?.address_line2,
          latitude: destination[i]?.latitude,
          longitude: destination[i]?.longitude,
          locationType: 'DROPOFF',
          sequence: i + 2,
        })
      }
      return createRideOrder({
        cost: routeData.cost,
        distance: routeData.distance,
        paymentMethod: card ? PaymentMethod.CREDIT_CARD : PaymentMethod.CASH,
        cardId: card?.id ?? '',
        locations: locations as any,
      })
    },
    onSuccess: async (data: any) => {
      if (data?.clientSecret) {
        const { paymentIntent, error } = await confirmPayment(data.clientSecret)
        if (error) {
          Alert.alert('Thanh toán thất bại', error.message)
        } else if (paymentIntent) {
          if (paymentIntent.status === 'Succeeded') {
            const order = await confirmPaymentAPI(data.id)
            if (order) {
              setOrder(order)
              removeDestinations()
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
        removeDestinations()
        router.replace({
          pathname: '/order',
          params: { orderId: data.id },
        })
      }
    },
    onError: (error: any) => {
      ToastAndroid.show('Đặt xe thất bại', ToastAndroid.SHORT)
    },
  })

  if (!routeData) return

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style='dark' />
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={customMapStyle}
        showsCompass={false}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        // showsUserLocation
      >
        {/* Vị trí điểm đi */}
        {(origin || userLocation) && (
          <Marker coordinate={origin || userLocation}>
            <Image source={icons.originPin} style={styles.customImageMarker} />
          </Marker>
        )}
        {/* Vị trí điểm đến */}
        {destination.length === 1 && destination[0] && (
          <Marker coordinate={destination[0] as LatLng}>
            <Image
              source={icons.destinationPin}
              style={styles.customImageMarker}
            />
          </Marker>
        )}
        {/* Vị trí điểm đến nhiều điểm */}
        {destination.length > 1 &&
          destination.map((item, index) => (
            <Marker key={index} coordinate={item as LatLng}>
              <Image
                source={destinationPin[index]}
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

      <BackButton />
      <RideOrderDetailBottomSheet
        origin={origin ?? userLocation}
        isPending={isPending}
        destination={destination.filter((item) => item !== null)}
        routeData={routeData!}
        handelCreateRideOrder={handleCreateOrder}
      />
    </GestureHandlerRootView>
  )
}

export default Maps

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
})
