import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { images } from '@/constants'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getOrderDetail } from '@/api/orderAPI'
import { useQuery } from '@tanstack/react-query'
import useOrder from '@/store/orderSlice'
const OrderInProgressBottomSheet = () => {
  const router = useRouter()
  const { order, setOrder } = useOrder()

  return (
    <BottomSheet
      snapPoints={[320]}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
    >
      <BottomSheetView collapsable={false} style={styles.contentContainer}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: '500' }}>
            Tài xế đang đến
          </Text>
          <Text style={{ fontSize: 14 }}>
            {
              order?.locations.find(
                (l) => l.sequence === order?.locationSequence
              )?.addressLine1
            }
          </Text>
        </View>
        <View style={{ ...styles.horizontalDivider, borderStyle: 'dotted' }} />
        <View style={styles.driverInfoContainer}>
          <View style={{ gap: 5 }}>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 18 }}>{order?.driver?.user.name}</Text>
              <View style={styles.driverRate}>
                <AntDesign name='star' size={16} color='#FFA500' />
                <Text>{order?.driver?.rating}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 14, color: '#4A4A4A' }}>
              {order?.driver?.vehicleModel}
            </Text>
            <View style={styles.licensePlateContainer}>
              <Text
                style={{ fontSize: 16, fontWeight: '700', color: '#00880C' }}
              >
                {order?.driver?.licensePlate}
              </Text>
            </View>
          </View>
          <Image
            source={images.defaultDriverAvatar}
            style={{ width: 70, height: 70 }}
          />
        </View>
        <View style={styles.horizontalDivider} />

        <View style={{ flexDirection: 'row', gap: 20, paddingVertical: 10 }}>
          <View style={styles.callButton}>
            <Ionicons name='call' size={18} color='#fff' />
          </View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => router.push('/chat')}
          >
            <Text style={{ color: '#4A4A4A' }}>Nhắn tin với tài xế</Text>
            <Ionicons name='chevron-forward' size={18} color='#4A4A4A' />
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

export default OrderInProgressBottomSheet

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    width: '100%',
    height: '50%',
  },
  horizontalDivider: {
    borderStyle: 'dashed',
    borderColor: '#E8E8E8',
    borderTopWidth: 1,
    marginVertical: 20,
  },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  callButton: {
    padding: 15,
    backgroundColor: '#00880C',
    alignSelf: 'flex-start',
    borderRadius: 100,
  },
  licensePlateContainer: {
    borderWidth: 1,
    borderColor: '#00880C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#E0FBD2',
    borderRadius: 10,
  },
  driverRate: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingVertical: 2,
  },
  driverInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
})
