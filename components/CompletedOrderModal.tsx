import React from 'react'
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getOrderDetail } from '@/api/orderAPI'
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import formatDate from '@/constants/formatDate'
import { OrderStatus, OrderType, PaymentMethod } from '@/types/type'
import { icons } from '@/constants'
import { ActivityIndicator } from 'react-native'

const CompletedOrderModal = ({
  orderId,
  handleClose,
}: {
  orderId: string
  handleClose: () => void
}) => {
  const router = useRouter()
  const destinationPin = [
    icons.destinationPin1,
    icons.destinationPin2,
    icons.destinationPin3,
  ]

  const {
    data: orderDetail,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => {
      return getOrderDetail(orderId)
    },
    enabled: !!orderId,
  })
  return (
    <Modal>
      <SafeAreaView style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={() => handleClose()}
          style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
        >
          <AntDesign name='arrowleft' size={24} color='black' />
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            Thông tin đơn hàng
          </Text>
        </TouchableOpacity>

        {isPending ? (
          <View
            style={{
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <ActivityIndicator color={'#00880C'} />
          </View>
        ) : (
          <>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 16,
                paddingBottom: 5,
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {orderDetail?.orderType === OrderType.DELIVERY
                    ? 'Giao hàng'
                    : orderDetail?.orderType === OrderType.FOOD_DELIVERY
                    ? 'Giao đồ ăn'
                    : 'Đặt xe'}
                </Text>
                <Text>
                  {orderDetail?.status === OrderStatus.COMPLETED
                    ? 'Chuyến đi hoàn thành'
                    : 'Chuyến đi đã bị huỷ'}
                </Text>
              </View>
              <View>
                <Text style={{ fontWeight: '300' }}>
                  {orderDetail && formatDate(orderDetail?.createdAt)}
                </Text>
                <Text numberOfLines={1} style={{ fontWeight: '300' }}>
                  Đơn hàng {orderDetail?.id.slice(0, 8)}
                  {'...'}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 2,
                marginVertical: 16,
                borderColor: '#F0EFEF',
                // borderStyle: 'dashed',
                backgroundColor: '#fff',
              }}
            />
            <View style={{ gap: 16 }}>
              <Text style={{ fontWeight: '600', color: '#646363' }}>
                Chi tiết
              </Text>
              <View style={styles.locationContainer}>
                <FontAwesome name='arrow-circle-up' size={28} color='#009112' />
                <View>
                  <Text style={styles.address1} numberOfLines={1}>
                    {
                      orderDetail?.locations?.find(
                        (location) => location.sequence === 1
                      )?.addressLine1
                    }
                  </Text>
                  <Text style={styles.address2} numberOfLines={2}>
                    {
                      orderDetail?.locations?.find(
                        (location) => location.sequence === 1
                      )?.addressLine2
                    }
                  </Text>
                </View>
              </View>
              {orderDetail?.locations?.length == 2 ? (
                <View style={styles.locationContainer}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name='location-on' size={16} color='#fff' />
                  </View>
                  <View>
                    <Text style={styles.address1} numberOfLines={1}>
                      {
                        orderDetail?.locations?.find(
                          (location) => location.sequence === 2
                        )?.addressLine1
                      }
                    </Text>
                    <Text style={styles.address2} numberOfLines={2}>
                      {
                        orderDetail?.locations?.find(
                          (location) => location.sequence === 2
                        )?.addressLine2
                      }
                    </Text>
                  </View>
                </View>
              ) : (
                orderDetail?.locations
                  ?.filter((location) => location.sequence != 1)
                  .map((location, index) => {
                    return (
                      <View style={styles.locationContainer} key={index}>
                        <Image
                          source={destinationPin[index]}
                          style={{ width: 24, height: 24 }}
                        />
                        <View>
                          <Text style={styles.address1} numberOfLines={1}>
                            {location.addressLine1}
                          </Text>
                          <Text style={styles.address2} numberOfLines={2}>
                            {location.addressLine2}
                          </Text>
                        </View>
                      </View>
                    )
                  })
              )}
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.paymentContainer}>
              <View style={styles.paymentDetail}>
                <Text style={{ fontSize: 16 }}>Cước phí</Text>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {orderDetail?.cost.toLocaleString('vi')} đ
                </Text>
              </View>
              <View style={styles.paymentDetail}>
                <Text style={{ fontSize: 16 }}>Khuyến mãi</Text>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>0đ</Text>
              </View>

              <View style={styles.paymentDetail}>
                <Text style={{ fontSize: 16 }}>Tổng</Text>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {orderDetail?.cost.toLocaleString('vi')} đ
                </Text>
              </View>
              <View style={styles.paymentDetail}>
                <Text style={{ fontSize: 16 }}>Phương thức thanh toán</Text>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {orderDetail?.paymentMethod === PaymentMethod.CASH
                    ? 'Tiền mặt'
                    : 'Thẻ tín dụng/ghi nợ'}
                </Text>
              </View>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  )
}

export default CompletedOrderModal

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '90%',
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
  address1: { fontSize: 16, fontWeight: 'bold' },
  address2: { fontSize: 14, color: '#646464' },
  paymentContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    // paddingVertical: 16,
    // marginVertical: 16,
    // borderColor: '#F0EFEF',
    // borderWidth: 1,
  },
  paymentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingVertical: 8,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
  },
  horizontalDivider: {
    borderBottomWidth: 1,
    marginVertical: 20,
    borderColor: '#F0EFEF',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
  },
})
