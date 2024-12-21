import { OrderStatus, OrderType } from '@/types/type'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants'
import { getAllOrders } from '@/api/orderAPI'
import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import CompletedOrderModal from '@/components/CompletedOrderModal'

const History = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['orders'],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getAllOrders(5, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage && lastPage.page.number + 1 < lastPage.page.totalPages
        ? lastPage.page.number + 1
        : undefined
    },
  })
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  function formatDate(isoString: string) {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    return `${hours}:${minutes}, ${day}/${month}/${year}`
  }
  const handleViewOrderDetail = (orderId: string, orderStatus: OrderStatus) => {
    if (
      orderStatus === OrderStatus.COMPLETED ||
      orderStatus === OrderStatus.CANCELED
    ) {
      setOrderId(orderId)
    } else {
      router.replace({
        pathname: '/order',
        params: { orderId: orderId },
      })
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 16, fontWeight: '600', padding: 16 }}>
        Lịch sử đơn hàng
      </Text>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size='large' color='#00880C' />
        </View>
      ) : isError ? (
        <Text>{error?.message}</Text>
      ) : (
        <FlatList
          data={data?.pages.flatMap((page) => page.content)}
          contentContainerStyle={{
            gap: 16,
            backgroundColor: '#f5f5f5',
            paddingTop: 16,
            marginBottom: 80,
          }}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator size='small' color='#00880C' />
            ) : null
          }
          onEndReached={() => {
            if (hasNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          stickyHeaderHiddenOnScroll
          renderItem={({ item }) => (
            <View style={styles.orderContainer}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Text style={{ color: '#646363' }}>
                  {formatDate(item.createdAt)}
                </Text>
                {/* order status */}
                <View
                  style={{
                    backgroundColor:
                      item.status === OrderStatus.COMPLETED
                        ? '#e0ffe0'
                        : item.status === OrderStatus.CANCELED
                        ? '#ffe1df'
                        : '#d3f4fb',
                    ...styles.orderStatusContainer,
                  }}
                >
                  <Text
                    style={{
                      ...styles.orderStatus,
                      color:
                        item.status === OrderStatus.COMPLETED
                          ? '#00880C'
                          : item.status === OrderStatus.CANCELED
                          ? '#ee2737'
                          : '#00add6',
                    }}
                  >
                    {item.status === OrderStatus.COMPLETED
                      ? 'Đã hoàn thành'
                      : item.status === OrderStatus.CANCELED
                      ? 'Đã huỷ'
                      : 'Đang vận chuyển'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View
                  style={{
                    backgroundColor:
                      item.orderType === OrderType.FOOD_DELIVERY
                        ? '#EE2737'
                        : item.orderType === OrderType.DELIVERY
                        ? '#00ADD6'
                        : '#00880C',
                    // padding: 16,
                    borderRadius: 20,
                    height: 50,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={
                      item.orderType === OrderType.FOOD_DELIVERY
                        ? icons.foodWhite
                        : item.orderType === OrderType.DELIVERY
                        ? icons.packageWhite
                        : icons.bikeWhite
                    }
                    style={{ height: 25, width: 25, resizeMode: 'contain' }}
                  />
                </View>
                <View style={styles.addressContainer}>
                  <View style={{ flex: 1, gap: 10 }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        flexShrink: 1,
                        color: '#2F2828',
                        fontWeight: '500',
                      }}
                    >
                      {item.orderType === OrderType.FOOD_DELIVERY
                        ? item.locations.find(
                            (location) => location.sequence === 1
                          )?.addressLine1 ?? 'Nhà hàng'
                        : item.locations?.reduce((max, location) =>
                            location.sequence > max.sequence ? location : max
                          ).addressLine1 ?? 'Điểm đón'}
                    </Text>
                    <Text style={{ color: '#646363' }}>
                      {item.orderType === OrderType.FOOD_DELIVERY &&
                        `${item.foodOrderItems.length} món`}
                    </Text>
                  </View>

                  <Text style={styles.cost}>
                    {item.cost.toLocaleString('vi')} đ
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#00880C',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                }}
                onPress={() => {
                  handleViewOrderDetail(item.id, item.status as OrderStatus)
                }}
              >
                <Text style={{ color: '#fff' }}>Chi tiết</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {orderId && (
        <CompletedOrderModal
          orderId={orderId}
          handleClose={() => setOrderId('')}
        />
      )}
    </SafeAreaView>
  )
}

export default History

const styles = StyleSheet.create({
  orderContainer: {
    backgroundColor: '#fff',
    padding: 16,
    gap: 16,
  },
  orderStatusContainer: { borderRadius: 10 },
  orderStatus: {
    color: '#00add6',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  addressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  cost: {
    textAlign: 'right',
    minWidth: 80,
    flexShrink: 0,
    fontWeight: '500',
  },
})
