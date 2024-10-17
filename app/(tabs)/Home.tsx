import { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native'
import MapView, { Polyline, Marker, LatLng } from 'react-native-maps'
import * as Location from 'expo-location'
import Constants from 'expo-constants'
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'
import axios from 'axios'

type InputAutocompleteProps = {
  label: string
  placeholder?: string
  onPlaceSelected: (details: GooglePlaceDetail | null) => void
}
function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ''}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details)
        }}
        query={{
          key: 'AlzaSyF0n4Xt3jGJEfG6ITYVVwMUux8keIMNxMO',
          language: 'vi',
          location: '21.028511,105.804817',
          radius: 30000,
        }}
      />
    </>
  )
}

export default function Home() {
  const [location, setLocation] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [origin, setOrigin] = useState<LatLng | null>()
  const [destination, setDestination] = useState<LatLng | null>()
  const [showDirections, setShowDirections] = useState(false)
  const [coordinates, setCoordinates] = useState<LatLng[]>([])
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
  const mapRef = useRef<MapView>(null)

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera()
    if (camera) {
      camera.center = position
      mapRef.current?.animateCamera(camera, { duration: 1000 })
    }
  }

  const edgePaddingValue = 70

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  }

  const getRoute = async () => {
    try {
      const response = await axios.get(
        `http://94.74.95.55:3000/path-finder?origin=${origin?.latitude},${origin?.longitude}&destination=${destination?.latitude},${destination?.longitude}`
      )
      setCoordinates(response.data.path)
    } catch (error) {
      setErrorMsg('Không thể tìm đường')
    }
  }

  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: 'origin' | 'destination'
  ) => {
    const set = flag === 'origin' ? setOrigin : setDestination
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    }
    set(position)
    moveTo(position)
  }
  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation.coords)
    })()
  }, [])

  if (location === null) {
    return <View></View>
  }
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <Polyline
            coordinates={[origin, destination]}
            strokeColor='#f00'
            strokeWidth={2}
            geodesic
            // onReady={traceRouteOnReady}
          />
        )}
        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeColor='#00f'
            strokeWidth={2}
            geodesic
          />
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <InputAutocomplete
          label='Điểm đi'
          onPlaceSelected={(details) => {
            onPlaceSelected(details, 'origin')
          }}
        />
        <InputAutocomplete
          label='Điểm đến'
          onPlaceSelected={(details) => {
            onPlaceSelected(details, 'destination')
          }}
        />
        <TouchableOpacity style={styles.button} onPress={() => getRoute()}>
          <Text style={styles.buttonText}>Tìm đường</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
  },
})
