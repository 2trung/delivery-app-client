import MapView, { Polyline, Marker, LatLng } from 'react-native-maps'
import useLocation from '@/store/locationSlice'
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import { customMapStyle } from '@/utils/mapStyle'
import { getRoute, reverse } from '@/api/mapAPI'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { Shadow } from 'react-native-shadow-2'
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import BackButton from '@/components/BackButton'
import { icons } from '@/constants'

const Maps = () => {
  const router = useRouter()
  const { origin, destination, userLocation, setUserLocation } = useLocation()
  const mapRef = useRef<MapView>(null)
  const { data } = useQuery({
    queryKey: ['route'],
    queryFn: () => {
      return getRoute(
        origin ?? (userLocation as LatLng),
        destination[destination.length - 1] as LatLng,
        destination.slice(0, -1) as LatLng[]
      )
    },
    enabled: (!!origin || !!userLocation) && !!destination,
  })

  useEffect(() => {
    if (data?.data?.path) {
      mapRef.current?.fitToCoordinates(data.data.path, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      })
    }
  }, [data])

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

  return (
    <GestureHandlerRootView style={styles.container}>
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
        {data?.data?.path && (
          <Polyline
            coordinates={data.data.path}
            strokeColor='#00aa13'
            strokeWidth={4}
            geodesic
          />
        )}
      </MapView>

      <BackButton />

      {/* Thông tin chuyến đi */}
      <BottomSheet snapPoints={['50%', '90%']}>
        <BottomSheetView style={styles.contentContainer}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ padding: 12, paddingRight: 0 }}>
              <FontAwesome name='arrow-circle-up' size={28} color='#009112' />
              <View style={styles.horizontalDivider} />
              <View style={styles.iconContainer}>
                <MaterialIcons name='location-on' size={16} color='#fff' />
              </View>
            </View>

            <View style={{ gap: 10, justifyContent: 'space-between' }}>
              <View style={{ marginLeft: 0 }}>
                <Text style={styles.address1}>
                  {origin ? origin.address_line1 : 'Vị trí của bạn'}
                </Text>
                <Text style={styles.address2} numberOfLines={2}>
                  {origin ? origin.address_line2 : userLocation.address_line2}
                </Text>
              </View>
              <View style={{ marginLeft: 0 }}>
                {destination.map((item, index) => (
                  <View key={index}>
                    <Text style={styles.address1}>{item?.address_line1}</Text>
                    <Text style={styles.address2} numberOfLines={2}>
                      {item?.address_line2}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.tripEstimateContainer}>
            <View>
              <Text style={styles.tripEstimate}>Tổng quãng đường:</Text>
              <Text style={styles.tripEstimate}>Thời gian dự kiến:</Text>
              <Text style={styles.tripEstimate}>Giá dự kiến:</Text>
            </View>
            <View>
              <Text>10km</Text>
              <Text>10p</Text>
              <Text
                style={{ color: '#00aa13', fontWeight: '600', fontSize: 16 }}
              >
                50.000 vnđ
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Lựa chọn thanh toán, voucher & xác nhận */}
      <Shadow style={{ width: '100%', zIndex: 1 }}>
        <View
          style={{
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            width: '100%',
            padding: 16,
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <TouchableOpacity style={styles.additionButton}>
              <MaterialCommunityIcons
                name='cash-multiple'
                size={24}
                color='#0aafd9'
              />
              <Text>Tiền mặt</Text>
              <Entypo name='chevron-down' size={16} color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.additionButton}>
              <MaterialIcons name='discount' size={16} color='#dc3f3d' />
              <Text>Voucher</Text>
              <Entypo name='chevron-right' size={16} color='black' />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              Đặt xe
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.tripTotal}>₫ 50.000</Text>
              <FontAwesome name='arrow-circle-right' size={24} color='#fff' />
            </View>
          </TouchableOpacity>
        </View>
      </Shadow>
    </GestureHandlerRootView>
  )
}

export default Maps

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  map: {
    height: '60%',
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
    height: 36,
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
    paddingVertical: 3.5,
    borderRadius: 100,
    width: 24,
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
  address2: { fontSize: 14, color: '#646464', width: '60%' },
})
