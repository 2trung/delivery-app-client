import { useRouter } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  // TextInput,
  Image,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  FontAwesome5,
  Ionicons,
  Feather,
  EvilIcons,
} from '@expo/vector-icons'
import { TextInput } from 'react-native-paper'
import { autocomplete } from '@/api/mapAPI'
import debounce from 'lodash.debounce'
import { Key, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useLocation from '@/store/locationSlice'
import { LatLng } from 'react-native-maps'
import { icons } from '@/constants'

const formatDistance = (distance: number) => {
  if (distance < 1000) {
    return `${distance.toFixed(0)} m`
  } else {
    return `${(distance / 1000).toFixed(1)} km`
  }
}

const SelectLocation = () => {
  const router = useRouter()
  const {
    userLocation,
    origin,
    destination,
    addDestination,
    removeDestination,
    clearDestination,
    setOrigin,
    removeDestinations,
    setDestination,
  } = useLocation()
  const [query, setQuery] = useState('')
  const [originAddress, setOriginAddress] = useState('')
  const [destinationAddress, setDestinationAddress] = useState<string[]>([''])
  const [currentFocus, setCurrentFocus] = useState<{
    type: 'origin' | 'destination'
    index: number
  }>({ type: 'destination', index: 0 })
  const destinationImage = [
    icons.destinationWhite1,
    icons.destinationWhite2,
    icons.destinationWhite3,
  ]

  const handleSelectLocation = (location: any) => {
    if (currentFocus.type === 'origin') {
      setOrigin({
        latitude: location.lat,
        longitude: location.lon,
        address_line1: location.address_line1,
        address_line2: location.address_line2,
      })
      setOriginAddress(location.address_line1)
    } else if (currentFocus.type === 'destination') {
      const newDestination = [...destinationAddress]
      newDestination[currentFocus.index ?? 0] = location.address_line1
      setDestinationAddress(newDestination)
      setDestination(
        {
          latitude: location.lat,
          longitude: location.lon,
          address_line1: location.address_line1,
          address_line2: location.address_line2,
        },
        currentFocus.index ?? 0
      )
    }
  }

  // Nhập địa chỉ
  const handleFocus = (type: 'origin' | 'destination', index: number) => {
    if (type === 'origin') setQuery(originAddress)
    else setQuery(destinationAddress[index ?? 0])
    setCurrentFocus({ type, index })
  }

  // Thay đổi những địa chỉ đến
  const onChangeDestinationText = (text: string, index: number) => {
    debouncedSearch(text)
    setDestinationAddress((prev) => {
      const newDestination = [...prev]
      newDestination[index] = text
      return newDestination
    })
  }

  // Thay đổi địa chỉ đi
  const onChangeOriginText = (text: string) => {
    debouncedSearch(text)
    setOriginAddress(text)
  }

  const handleOnBlur = (type: 'origin' | 'destination', index?: number) => {
    if (type === 'origin' && origin) setOriginAddress(origin.address_line1)
    if (type === 'destination' && index !== undefined && destination[index]) {
      const newDestination = [...destinationAddress]
      newDestination[index] = destination[index].address_line1
      setDestinationAddress(newDestination)
    }
  }

  const debouncedSearch = useRef(
    debounce((searchQuery: string) => {
      setQuery(searchQuery)
    }, 300)
  ).current

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => {
      return autocomplete(query, userLocation as LatLng)
    },
    enabled: !!query,
  })
  const handleDeleteDestination = (index: number) => {
    if (currentFocus.type === 'destination' && currentFocus.index === index) {
      setQuery('')
      setCurrentFocus({ type: 'destination', index: index })
    }
    const newDestinationAddress = [...destinationAddress]
    newDestinationAddress.splice(index, 1)
    setDestinationAddress(newDestinationAddress)
    removeDestination(index)
  }

  const handleClearDestination = (index: number) => {
    setQuery('')
    const newDestination = [...destinationAddress]
    newDestination[index] = ''
    setDestinationAddress(newDestination)
    clearDestination(index)
  }

  const clearLocation = () => {
    setOrigin()
    removeDestinations()
  }

  useEffect(() => {
    clearLocation()
    const backAction = () => {
      clearLocation()
      router.back()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    if (destination.every(Boolean)) {
      router.push('/ride/Maps')
    }
  }, [destination, origin])
  return (
    <SafeAreaView style={styles.container}>
      {/* Tiêu đề & quay lại */}
      <View style={styles.titleContainer}>
        <TouchableOpacity
          onPress={() => {
            router.back()
            clearLocation()
          }}
        >
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.title}>Bạn muốn đi đâu?</Text>
      </View>

      {/* Chọn vị trí */}
      <View style={styles.selectLocationsContainer}>
        <View style={{ padding: 12, paddingRight: 0, alignItems: 'center' }}>
          <FontAwesome name='arrow-circle-up' size={28} color='#009112' />
          {destinationAddress.length === 1
            ? destinationAddress.map((_, index) => (
                <View key={index}>
                  <View style={styles.horizontalDivider} />
                  <View style={styles.iconContainer}>
                    <Image
                      source={icons.destinationWhite}
                      style={{ width: 16, height: 16, resizeMode: 'contain' }}
                    />
                  </View>
                </View>
              ))
            : destinationAddress.map((_, index) => (
                <View key={index}>
                  <View style={styles.horizontalDivider} />
                  <View style={styles.iconContainer}>
                    <Image
                      source={destinationImage[index]}
                      style={{ width: 16, height: 16, resizeMode: 'contain' }}
                    />
                  </View>
                </View>
              ))}
        </View>
        <View
          style={{
            // marginLeft: 10,
            width: '90%',
            paddingVertical: 6,
            // justifyContent: 'space-between',
          }}
        >
          <TextInput
            style={{ ...styles.input, width: '100%' }}
            cursorColor='black'
            placeholder='Vị trí hiện tại'
            placeholderTextColor='#8E8E8E'
            mode='outlined'
            outlineColor='transparent'
            activeOutlineColor='transparent'
            onChangeText={onChangeOriginText}
            value={originAddress}
            onFocus={() => handleFocus('origin', -1)}
            onBlur={() => handleOnBlur('origin')}
            right={
              originAddress &&
              currentFocus.type === 'origin' && (
                <TextInput.Icon
                  icon='close-circle'
                  size={16}
                  color='#414b52'
                  onPress={() => {
                    setQuery('')
                    setOriginAddress('')
                  }}
                />
              )
            }
          />

          {destinationAddress.map((_, index) => (
            <View key={index}>
              <View style={styles.verticalDivider} />
              <View style={{ justifyContent: 'center' }}>
                <TextInput
                  style={styles.input}
                  cursorColor='black'
                  placeholder='Tìm điểm đến'
                  placeholderTextColor='#8E8E8E'
                  mode='outlined'
                  outlineColor='#fff'
                  activeOutlineColor='#fff'
                  onChangeText={(text) => onChangeDestinationText(text, index)}
                  value={destinationAddress[index]}
                  onFocus={() => handleFocus('destination', index)}
                  onBlur={() => handleOnBlur('destination', index)}
                  right={
                    destinationAddress[index] &&
                    currentFocus.type === 'destination' &&
                    currentFocus?.index === index && (
                      <TextInput.Icon
                        icon='close-circle'
                        size={16}
                        color='#414b52'
                        onPress={() => handleClearDestination(index)}
                      />
                    )
                  }
                />
                {destinationAddress.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleDeleteDestination(index)}
                    style={{
                      position: 'absolute',
                      right: '5%',
                    }}
                  >
                    {/* <Feather name='x' size={24} color='black' /> */}
                    <EvilIcons name='trash' size={24} color='red' />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.additionButtonContainer}>
        <TouchableOpacity
          style={{
            ...styles.addLocationButton,
            display: destinationAddress.length > 2 ? 'none' : 'flex',
          }}
          onPress={() => {
            addDestination()
            setDestinationAddress([...destinationAddress, ''])
          }}
        >
          <AntDesign name='plus' size={18} color='#596169' />
          <Text style={{ color: '#596169' }}>Thêm điểm đến</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{}}>
          <Text style={{ color: '#009112' }}>Chọn từ bản đồ</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách vị trí */}
      <ScrollView
        style={{ flex: 1, marginTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {((currentFocus.type === 'destination' &&
          !destination[currentFocus.index]) ||
          (currentFocus.type === 'origin' && !origin)) &&
          data?.results.map((location: any, index: Key | null | undefined) => (
            <Pressable
              style={styles.locationContainer}
              key={index}
              onPress={() => handleSelectLocation(location)}
            >
              <View style={{ alignItems: 'center', gap: 5 }}>
                <FontAwesome5 name='map-marker-alt' size={20} color='#BBBBBB' />
                <Text style={{ color: '#BBBBBB', fontSize: 12 }}>
                  {formatDistance(location.distance)}
                </Text>
              </View>
              {/* <FontAwesome name='bookmark' size={24} color='#BBBBBB' /> */}
              <View style={{ width: '80%', paddingHorizontal: 10 }}>
                <Text numberOfLines={1} style={styles.locationName}>
                  {location.address_line1}
                </Text>
                <Text numberOfLines={2} style={styles.locationAddress}>
                  {location.address_line2}
                </Text>
              </View>
              <FontAwesome name='bookmark-o' size={24} color='#596169' />
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default SelectLocation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  titleContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F96B00',
    borderRadius: 100,
    height: 24,
    width: 24,
    margin: 1,
  },
  selectLocationsContainer: {
    // gap: 20,
    // marginVertical: 20,
    // padding: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#E8E8E8',
  },
  selectLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verticalDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 2,
    width: '90%',
    alignSelf: 'center',
  },
  horizontalDivider: {
    height: 10,
    left: 12,
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    marginBottom: 5,
    width: '100%',
  },
  input: {
    height: 40,
    width: '90%',
    backgroundColor: 'transparent',
    fontSize: 18,
    paddingLeft: 0,
  },
  additionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  addLocationButton: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    // padding: 12,
    // padding: 5,
    // marginVertical: 20,
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
    borderTopWidth: 1,
    // borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: '#E8E8E8',
  },
})
