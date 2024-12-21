import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
const Notification = () => {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View style={{ alignSelf: 'center' }}>
        <Text style={{ fontWeight: '500', fontSize: 20, padding: 16 }}>
          Thông báo
        </Text>
      </View>
      <View style={{ gap: 20 }}>
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 10 }}>
          {/* <View style={{ height: 100, width: 100, backgroundColor: '#000' }} /> */}
          <Image
            source={images.noti1}
            style={{ height: 100, width: 100, borderRadius: 10 }}
            resizeMode='cover'
          />
          <View style={{ flex: 1 }}>
            <Text style={{ flex: 1 }}>
              Siêu nhiều ưu đãi HD SAISON, giảm đến 80K mỗi ngày
            </Text>
            <Text
              style={{ flex: 1, fontSize: 12, color: '#646363' }}
              numberOfLines={3}
            >
              🔥Ưu đãi 1: Giảm 15.000đ cho chuyến đi từ 30.000đ, áp dụng dịch vụ
              đặt xe.
              {'\n'}
              🔥Ưu đãi 2: Giảm 25.000đ cho chuyến đi từ 60.000đ, áp dụng dịch vụ
              đặt xe.
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 10 }}>
          {/* <View style={{ height: 100, width: 100, backgroundColor: '#000' }} /> */}
          <Image
            source={images.noti2}
            style={{ height: 100, width: 100, borderRadius: 10 }}
            resizeMode='cover'
          />
          <View style={{ flex: 1 }}>
            <Text style={{ flex: 1 }} numberOfLines={2}>
              Tiệc deal McDONALD’s đồng giá 99k + 1 Burger Xúc Xích Nướng
            </Text>
            <Text
              style={{ flex: 1, fontSize: 12, color: '#646363' }}
              numberOfLines={3}
            >
              🎉 Tiệc deal McDONALD’s đồng giá 99k Combo 2 Miếng Gà + 1 Burger
              Xúc Xích Nướng lại còn được các bác tài giao siêu tốc!
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Notification

const styles = StyleSheet.create({})
