import { AntDesign } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import useDeliveryStore from '@/store/deliverySlice'
import useUser from '@/store/userSlice'
import { DeliveryLocation, LocationDetail } from '@/types/type'
import SearchAddressModal from '@/components/SearchAddressModal'

const FillAddress = () => {
  const { sequence } = useLocalSearchParams()
  const router = useRouter()
  const { locations, updateLocation } = useDeliveryStore()
  const { user } = useUser()
  const mapRef = useRef<MapView>(null)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<DeliveryLocation>({
    name: '',
    phoneNumber: '',
    latitude: 0,
    longitude: 0,
    addressLine1: '',
    addressLine2: '',
    sequence: parseInt(sequence as string),
  })

  useEffect(() => {
    const location = locations.find(
      (location) => location.sequence === parseInt(sequence as string)
    )
    if (location) {
      const phoneNumber = location.phoneNumber.split('+84')[1]
      setEditingLocation({ ...location, phoneNumber })
    }
  }, [])

  const setAddresses = (location: any) => {
    setEditingLocation((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lon,
      addressLine1: location.address_line1,
      addressLine2: location.address_line2,
    }))
  }
  const useMyInfo = () => {
    if (user)
      setEditingLocation((prev) => ({
        ...prev,
        name: user.name,
        phoneNumber: user.phoneNumber.split('+84')[1],
      }))
  }
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneNumberRegex = /^(0|(\+84)|(\+840))?[35789][0-9]{8}$/
    return phoneNumberRegex.test(phoneNumber)
  }
  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleanedPhoneNumber = phoneNumber.replace(/[^0-9+]/g, '')
    if (cleanedPhoneNumber.startsWith('+84'))
      return cleanedPhoneNumber.replace(/^\+840/, '+84')
    else if (cleanedPhoneNumber.startsWith('0'))
      return '+84' + cleanedPhoneNumber.slice(1)
    else return '+84' + cleanedPhoneNumber
  }
  const handleSave = () => {
    if (!editingLocation.addressLine2)
      return Alert.alert('Địa chỉ không được để trống')
    if (!editingLocation.name) return Alert.alert('Tên không được để trống')
    if (!validatePhoneNumber(editingLocation.phoneNumber))
      return Alert.alert('Số điện thoại không hợp lệ')
    editingLocation.phoneNumber = formatPhoneNumber(editingLocation.phoneNumber)
    updateLocation(editingLocation)
    router.back()
  }

  useEffect(() => {
    if (editingLocation.latitude && editingLocation.longitude) {
      mapRef.current?.animateCamera({
        center: {
          latitude: editingLocation.latitude,
          longitude: editingLocation.longitude,
        },
        zoom: 15,
      })
    }
  }, [editingLocation])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#000' />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name='arrowleft' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.title}>Địa chỉ giao hàng</Text>
      </View>
      <KeyboardAvoidingView behavior='height' style={{ flex: 1 }}>
        <ScrollView
          style={{ paddingHorizontal: 16, paddingTop: 20 }}
          contentContainerStyle={{ gap: 30, paddingBottom: 120 }}
        >
          <View style={styles.addressContainer}>
            <View style={{ borderRadius: 10, overflow: 'hidden' }}>
              <MapView
                ref={mapRef}
                style={{ height: 120, borderRadius: 10 }}
                initialRegion={{
                  latitude: 21.028511,
                  longitude: 105.804817,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {editingLocation.latitude ? (
                  <Marker
                    coordinate={{
                      latitude: editingLocation.latitude,
                      longitude: editingLocation.longitude,
                    }}
                  />
                ) : (
                  <></>
                )}
              </MapView>
            </View>
            <View style={styles.addressTitle}>
              <Text style={{ fontWeight: '600', fontSize: 16 }}>
                {sequence === '1' ? 'Địa chỉ lấy hàng' : 'Địa chỉ giao hàng'}
              </Text>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => setShowSearchModal(true)}
              >
                <Text style={styles.buttonTitle}>
                  {editingLocation?.addressLine1 ? 'Thay đổi' : 'Chọn'}
                </Text>
              </TouchableOpacity>
            </View>
            {editingLocation?.addressLine1 && (
              <View
                style={{ paddingHorizontal: 8, paddingVertical: 8, gap: 3 }}
              >
                <Text style={{ fontWeight: '500' }}>
                  {editingLocation?.addressLine1}
                </Text>
                <Text style={{ fontWeight: '400' }}>
                  {editingLocation?.addressLine2}
                </Text>
              </View>
            )}
          </View>
          <View style={{ gap: 20 }}>
            <View
              style={{ flexDirection: 'row', gap: 40, alignItems: 'center' }}
            >
              <Text style={{ fontWeight: '600', fontSize: 16 }}>
                {sequence === '1'
                  ? 'Thông tin người gửi'
                  : 'Thông tin người nhận'}
              </Text>
              <TouchableOpacity
                style={{ ...styles.buttonContainer, flex: 1 }}
                onPress={() => useMyInfo()}
              >
                <Text style={styles.buttonTitle} numberOfLines={2}>
                  Sử dụng thông tin của tôi
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{ color: '#494b4a', fontWeight: '500' }}>
                {sequence === '1' ? 'Tên người gửi' : 'Tên người nhận'}{' '}
                <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                placeholder={
                  sequence === '1'
                    ? 'Nhập tên người gửi...'
                    : 'Nhập tên người nhận...'
                }
                placeholderTextColor={'#8E8E8E'}
                cursorColor={'#000'}
                style={styles.textInput}
                onChangeText={(text) =>
                  setEditingLocation((prev) => ({ ...prev, name: text }))
                }
                value={editingLocation.name}
              />
            </View>
            <View>
              <Text style={{ color: '#494b4a', fontWeight: '500' }}>
                Số điện thoại <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <View
                style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
              >
                <Text
                  style={{ color: '#494b4a', fontWeight: '500', fontSize: 18 }}
                >
                  +84
                </Text>
                <TextInput
                  placeholder='Nhập số điện thoại...'
                  placeholderTextColor={'#8E8E8E'}
                  keyboardType='phone-pad'
                  cursorColor={'#000'}
                  style={{ flex: 1, ...styles.textInput }}
                  onChangeText={(text) =>
                    setEditingLocation((prev) => ({
                      ...prev,
                      phoneNumber: text,
                    }))
                  }
                  value={editingLocation.phoneNumber}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.saveButtonContainer}>
          <Pressable style={styles.confirmButton} onPress={() => handleSave()}>
            <Text style={styles.saveButtonTitle}>Lưu lại</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {showSearchModal && (
        <SearchAddressModal
          setAddresses={setAddresses}
          onClose={() => setShowSearchModal(false)}
        />
      )}
    </SafeAreaView>
  )
}

export default FillAddress

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    height: '100%',
    // justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
    elevation: 5,
  },
  title: { color: '#000', fontSize: 20, fontWeight: '500' },
  saveButtonTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  saveButtonContainer: {
    width: '100%',
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
  addressContainer: {
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    backgroundColor: '#e0ffe0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 100,
  },
  addressTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  buttonTitle: {
    color: '#00880C',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
})
