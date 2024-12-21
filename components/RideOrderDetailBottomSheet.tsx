import { LocationDetail, PaymentMethod, Route } from '@/types/type'
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { icons } from '@/constants'
import usePaymentMethod from '@/store/paymentMethodSlice'
import { useState } from 'react'
import PaymentMethodBottomSheet from './PaymentMethodBottomSheet'

const RideOrderDetailBottomSheet = ({
  isPending,
  origin,
  destination,
  routeData,
  handelCreateRideOrder,
}: {
  isPending: boolean
  origin: LocationDetail
  destination: LocationDetail[]
  routeData: Route
  handelCreateRideOrder: () => void
}) => {
  const destinationPin = [
    icons.destinationPin1,
    icons.destinationPin2,
    icons.destinationPin3,
  ]
  const { paymentMethod, card } = usePaymentMethod()
  const [isShowPaymentMethod, setIsShowPaymentMethod] = useState(false)
  return (
    <>
      <BottomSheet snapPoints={['50%', '90%']} enablePanDownToClose={false}>
        <BottomSheetView style={styles.contentContainer}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <View style={{ gap: 10 }}>
              <View style={styles.addressContainer}>
                <FontAwesome name='arrow-circle-up' size={28} color='#009112' />
                <View>
                  <Text style={styles.address1} numberOfLines={1}>
                    {origin.address_line1 ?? 'Vị trí của bạn'}
                  </Text>
                  <Text style={styles.address2} numberOfLines={2}>
                    {origin.address_line2}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginLeft: 0,
                  gap: 10,
                  justifyContent: 'center',
                  width: '95%',
                }}
              >
                {destination.length === 1 ? (
                  <View style={styles.addressContainer}>
                    <View style={styles.iconContainer}>
                      <MaterialIcons
                        name='location-on'
                        size={16}
                        color='#fff'
                      />
                    </View>
                    <View>
                      <Text style={styles.address1} numberOfLines={1}>
                        {destination[0]?.address_line1}
                      </Text>
                      <Text style={styles.address2} numberOfLines={2}>
                        {destination[0]?.address_line2}
                      </Text>
                    </View>
                  </View>
                ) : (
                  destination.map((item, index) => (
                    <View key={index} style={styles.addressContainer}>
                      <View style={styles.iconContainer}>
                        <Image
                          source={destinationPin[index]}
                          style={{
                            height: 16,
                            width: 16,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <View>
                        <Text style={styles.address1} numberOfLines={1}>
                          {item?.address_line1}
                        </Text>
                        <Text style={styles.address2} numberOfLines={2}>
                          {item?.address_line2}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
          <View style={styles.horizonLine} />
          <View style={styles.tripEstimateContainer}>
            <View>
              <Text style={styles.tripEstimate}>Tổng quãng đường:</Text>
              <Text style={styles.tripEstimate}>Thời gian dự kiến:</Text>
              <Text style={styles.tripEstimate}>Giá dự kiến:</Text>
            </View>
            <View>
              <Text>{(routeData.distance as number)?.toFixed(2)} km</Text>
              <Text>{routeData.duration}</Text>
              <Text
                style={{
                  color: '#00aa13',
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                {routeData.cost?.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
        }}
      >
        <Animated.View style={styles.confirmContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Pressable
              style={styles.additionButton}
              onPress={() => setIsShowPaymentMethod(true)}
            >
              {paymentMethod === PaymentMethod.CASH ? (
                <MaterialCommunityIcons
                  name='cash-multiple'
                  size={20}
                  color='#0aafd9'
                />
              ) : (
                <FontAwesome
                  name={card?.brand === 'visa' ? 'cc-visa' : 'cc-mastercard'}
                  size={20}
                  color={card?.brand === 'visa' ? '#1A1F71' : '#FF5F00'}
                />
              )}

              <Text style={{ fontWeight: '600' }}>
                {paymentMethod === PaymentMethod.CASH
                  ? 'Tiền mặt'
                  : `${card?.brand.toUpperCase()}*${card?.last4}`}
              </Text>
              <Entypo name='chevron-down' size={16} color='black' />
            </Pressable>
            <TouchableOpacity style={styles.additionButton}>
              <MaterialIcons name='discount' size={16} color='#dc3f3d' />
              <Text style={{ fontWeight: '600' }}>Voucher</Text>
              <Entypo name='chevron-right' size={16} color='black' />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              ...styles.confirmButton,
              justifyContent: isPending ? 'center' : 'space-between',
            }}
            onPress={() => handelCreateRideOrder()}
          >
            {isPending ? (
              <ActivityIndicator
                size='small'
                color='#fff'
                style={{ paddingVertical: 2 }}
              />
            ) : (
              <>
                <Text
                  style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}
                >
                  Đặt xe
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Text style={styles.tripTotal}>
                    ₫ {routeData.cost?.toLocaleString('vi-VN')}
                  </Text>
                  <FontAwesome
                    name='arrow-circle-right'
                    size={24}
                    color='#fff'
                  />
                </View>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      {isShowPaymentMethod && (
        <PaymentMethodBottomSheet
          onClose={() => setIsShowPaymentMethod(false)}
        />
      )}
    </>
  )
}

export default RideOrderDetailBottomSheet

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    width: '100%',
    height: '50%',
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
    padding: 10,
    // marginVertical: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '90%',
    height: 60,
  },
  horizonLine: {
    borderBottomWidth: 1,
    marginVertical: 16,
    borderColor: '#F0EFEF',
    borderStyle: 'dashed',
  },
  confirmContainer: {
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 10,
  },
})
