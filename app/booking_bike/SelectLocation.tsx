import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  MaterialIcons,
  FontAwesome,
  AntDesign,
  FontAwesome5,
} from '@expo/vector-icons'
import { TextInput } from 'react-native-paper'
import { autocomplete } from '@/api/mapAPI'
import debounce from 'lodash.debounce'
import { Key, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useLocation from '@/store/locationSlice'
import { LatLng } from 'react-native-maps'

const formatDistance = (distance: number) => {
  if (distance < 1000) {
    return `${distance.toFixed(0)} m`
  } else {
    return `${(distance / 1000).toFixed(1)} km`
  }
}

const SelectLocation = () => {
  const router = useRouter()
  const { userLocation, origin, destination, setDestination, setOrigin } =
    useLocation()
  const [query, setQuery] = useState('')
  const [originAddress, setOriginAddress] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [currentFocus, setCurrentFocus] = useState<'origin' | 'destination'>(
    'origin'
  )

  const handleSelectLocation = (location: any) => {
    setQuery('')
    if (currentFocus === 'origin') {
      setOrigin({
        latitude: location.lat,
        longitude: location.lon,
        address_line1: location.address_line1,
        address_line2: location.address_line2,
      })
      setOriginAddress(location.address_line1)
      if (destination) router.push('/booking_bike/Maps')
      return
    }
    setDestination({
      latitude: location.lat,
      longitude: location.lon,
      address_line1: location.address_line1,
      address_line2: location.address_line2,
    })
    setDestinationAddress(location.address_line1)
    router.push('/booking_bike/Maps')
    // navigate to the next screen
  }

  const handleFocus = (focus: 'origin' | 'destination') => {
    setQuery('')
    setCurrentFocus(focus)
  }

  const onChangeDestinationText = (text: string) => {
    debouncedSearch(text)
    setDestinationAddress(text)
  }

  const onChangeOriginText = (text: string) => {
    debouncedSearch(text)
    setOriginAddress(text)
  }

  const handleOnBlur = (blur: 'origin' | 'destination') => {
    if (blur === 'origin') setOriginAddress(origin?.address_line1 || '')
    else setDestinationAddress(destination?.address_line1 || '')
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

  useEffect(() => {
    setOrigin()
    setDestination()
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.title}>Bạn muốn đi đâu?</Text>
      </View>

      <View style={styles.selectLocationsContainer}>
        <View style={{ padding: 12, paddingRight: 0 }}>
          <FontAwesome name='arrow-circle-up' size={28} color='#009112' />
          <View style={styles.horizontalDivider} />
          <View style={styles.iconContainer}>
            <MaterialIcons name='location-on' size={16} color='#fff' />
          </View>
        </View>
        <View
          style={{
            marginLeft: 0,
            width: '90%',
            paddingVertical: 6,
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            style={styles.input}
            cursorColor={'black'}
            mode='outlined'
            outlineColor='#fff'
            activeOutlineColor='#fff'
            placeholder='Vị trí hiện tại'
            placeholderTextColor={'#8E8E8E'}
            onChangeText={onChangeOriginText}
            value={originAddress}
            onFocus={() => handleFocus('origin')}
            onBlur={() => handleOnBlur('origin')}
          />
          <View style={styles.verticalDivider} />
          <TextInput
            style={styles.input}
            cursorColor={'black'}
            mode='outlined'
            outlineColor='#fff'
            activeOutlineColor='#fff'
            placeholder='Tìm điểm đến'
            placeholderTextColor={'#8E8E8E'}
            onChangeText={onChangeDestinationText}
            value={destinationAddress}
            onFocus={() => handleFocus('destination')}
            onBlur={() => handleOnBlur('destination')}
          />
        </View>
      </View>
      <View style={styles.additionButtonContainer}>
        <TouchableOpacity style={styles.addLoctionButton}>
          <AntDesign name='plus' size={18} color='#596169' />
          <Text style={{ color: '#596169' }}>Thêm điểm đến</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{}}>
          <Text style={{ color: '#009112' }}>Chọn từ bản đồ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {((currentFocus === 'destination' && !destination) ||
          (currentFocus === 'origin' && !origin)) &&
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
    paddingVertical: 3.5,
    borderRadius: 100,
    width: 24,
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
    // marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
  horizontalDivider: {
    height: 18,
    left: 12,
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    marginBottom: 5,
    width: '100%',
  },
  input: {
    height: 36,
    width: '90%',
    padding: 0,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  additionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  addLoctionButton: {
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
