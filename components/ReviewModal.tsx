import { Ionicons } from '@expo/vector-icons'
import { Modal, TouchableOpacity, View, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import useOrder from '@/store/orderSlice'
import { useState } from 'react'

const ReviewModal = () => {
  const router = useRouter()
  const [star, setStar] = useState(5)
  const { clearOrder } = useOrder()
  const handleReview = () => {
    clearOrder()
    router.replace('/(tabs)/Home')
  }
  return (
    <Modal statusBarTranslucent>
      <SafeAreaView style={{ paddingHorizontal: 16, height: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 10,
            elevation: 5,
          }}
        >
          <TouchableOpacity onPress={() => handleReview()}>
            <Ionicons name='close' size={28} color='#000' />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            Đánh giá chuyến đi
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 20,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500' }}>
            Chuyến đi của bạn thế nào?
          </Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Ionicons
              name='star'
              size={36}
              color={star >= 1 ? '#00880C' : '#D3D3D3'}
              onPress={() => setStar(1)}
            />
            <Ionicons
              name='star'
              size={36}
              color={star >= 2 ? '#00880C' : '#D3D3D3'}
              onPress={() => setStar(2)}
            />
            <Ionicons
              name='star'
              size={36}
              color={star >= 3 ? '#00880C' : '#D3D3D3'}
              onPress={() => setStar(3)}
            />
            <Ionicons
              name='star'
              size={36}
              color={star >= 4 ? '#00880C' : '#D3D3D3'}
              onPress={() => setStar(4)}
            />
            <Ionicons
              name='star'
              size={36}
              color={star >= 5 ? '#00880C' : '#D3D3D3'}
              onPress={() => setStar(5)}
            />
          </View>
        </View>
        <View style={{ gap: 5, marginVertical: 20 }}>
          <Text style={{ paddingHorizontal: 5, fontWeight: '500' }}>
            Nhận xét của bạn:
          </Text>
          <TextInput
            // placeholder='Nhận xét của bạn'
            numberOfLines={5}
            textAlignVertical='top'
            multiline
            style={{
              borderWidth: 1,
              borderColor: '#E8E8E8',
              borderRadius: 20,
              padding: 16,
              marginBottom: 20,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            handleReview()
            // setStage(Stage.IDLE)
            // router.navigate('/home')
          }}
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#00880C',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderRadius: 20,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: '600' }}>
            Xong
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  )
}

export default ReviewModal
