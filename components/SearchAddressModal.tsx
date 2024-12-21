import { AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import useLocation from '@/store/locationSlice'
import { autocomplete } from '@/api/mapAPI'
import { useQuery } from '@tanstack/react-query'
import { LocationDetail } from '@/types/type'

const formatDistance = (distance: number) => {
  if (distance < 1000) {
    return `${distance.toFixed(0)} m`
  } else {
    return `${(distance / 1000).toFixed(1)} km`
  }
}

const SearchAddressModal = ({
  setAddresses,
  onClose,
}: {
  setAddresses: (addresses: LocationDetail) => void
  onClose: () => void
}) => {
  const router = useRouter()
  const { userLocation } = useLocation()
  const [isFocused, setIsFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  function debounce(fn: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  const debounceSearch = useMemo(
    () => debounce((term) => setDebouncedSearchTerm(term), 500),
    []
  )

  const data = useQuery({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () =>
      autocomplete(debouncedSearchTerm, {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      }),
    enabled: !!debouncedSearchTerm,
  })
  return (
    <Modal visible>
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => onClose()}>
            <AntDesign name='arrowleft' size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.title}>Tìm kiếm địa chỉ</Text>
        </View>

        <View
          style={{
            backgroundColor: '#f5f5f5',
            borderWidth: 1,
            margin: 16,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderColor: isFocused ? '#00880C' : '#E8E8E8',
          }}
        >
          <TextInput
            placeholder='Nhập địa chỉ...'
            style={styles.textInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => {
              setSearchTerm(text)
              debounceSearch(text)
            }}
          />
        </View>
        <FlatList
          data={data?.data?.results}
          // columnWrapperStyle={{ padding: 16 }}
          style={{ padding: 16 }}
          // keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.locationContainer}
              key={index}
              onPress={() => {
                onClose()
                setAddresses(item as any)
              }}
            >
              <View style={{ alignItems: 'center', gap: 5 }}>
                <FontAwesome5 name='map-marker-alt' size={20} color='#BBBBBB' />
                <Text style={{ color: '#BBBBBB', fontSize: 12 }}>
                  {formatDistance(item.distance)}
                </Text>
              </View>
              {/* <FontAwesome name='bookmark' size={24} color='#BBBBBB' /> */}
              <View style={{ width: '80%', paddingHorizontal: 10 }}>
                <Text numberOfLines={1} style={styles.locationName}>
                  {item.address_line1}
                </Text>
                <Text numberOfLines={2} style={styles.locationAddress}>
                  {item.address_line2}
                </Text>
              </View>
              <FontAwesome name='bookmark-o' size={24} color='#596169' />
            </Pressable>
          )}
        />
      </SafeAreaView>
    </Modal>
  )
}

export default SearchAddressModal
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
    // padding: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  locationAddress: {
    fontSize: 14,
    color: '#596169',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    // borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: '#E8E8E8',
  },
})
