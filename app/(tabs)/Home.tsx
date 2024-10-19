import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
const Home = () => {
  const route = useRouter()
  const [greeting, setGreeting] = useState('')
  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours()

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Chào buổi sáng,')
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Chào buổi trưa,')
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting('Chào buổi chiều,')
      } else {
        setGreeting('Chào buổi tối,')
      }
    }
    getGreeting()
    const intervalId = setInterval(getGreeting, 60000)
    return () => clearInterval(intervalId)
  }, [])
  return (
    <View style={styles.container}>
      {/* Top bar */}
      <SafeAreaView style={styles.topBarContainer}>
        <Text style={{ color: '#fff' }}>
          {greeting}{' '}
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>
            Nguyễn Văn A
          </Text>
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TextInput
            style={styles.seachInput}
            left={<TextInput.Icon icon='magnify' />}
            placeholder='Tìm kiếm'
            placeholderTextColor={'#8E8E8E'}
            mode='outlined'
            // outlineColor='#dddee5'
            activeOutlineColor={'#fff'}
            theme={{ roundness: 25 }}
            cursorColor={'black'}
            // returnKeyType='search'
            keyboardType='web-search'
            onSubmitEditing={() => {
              // Handle search action here
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderRadius: 999,
            }}
          >
            <FontAwesome name='bookmark' size={24} color='#006C02' />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.bodyContainer}>
        {/* Main features */}
        {/* <Text
          style={{
            paddingTop: 16,
            paddingBottom: 10,
            fontSize: 20,
            fontWeight: '600',
          }}
        >
          Dịch vụ
        </Text> */}
        <View
          style={{
            flexDirection: 'row',
            padding: 20,
            justifyContent: 'space-around',
            marginVertical: 16,
            backgroundColor: '#fff',
            borderRadius: 20,
            elevation: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => route.push('/booking_bike/SelectLocation')}
          >
            <View
              style={{
                backgroundColor: '#E5F9D4',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={require('@/assets/images/bike.png')}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Đặt xe</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                backgroundColor: '#FAE3E2',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={require('@/assets/images/food.png')}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Đồ ăn</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={{
                backgroundColor: '#D8F2F9',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={require('@/assets/images/package.png')}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Giao hàng</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            paddingTop: 16,
            paddingBottom: 10,
            fontSize: 20,
            fontWeight: '600',
          }}
        >
          Chuyến xe gần đây
        </Text>
        <View
          style={{
            gap: 15,
            borderRadius: 20,
            padding: 10,
            // backgroundColor: '#fff',
            borderColor: '#E8E8E8',
            borderWidth: 1,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#00aa12',
                  padding: 10,
                  borderRadius: 100,
                }}
              >
                <Image
                  source={require('@/assets/images/bike_white.png')}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }}
                />
              </View>
              <Text style={{ marginLeft: 10, width: '75%' }} numberOfLines={1}>
                Trường Đại Học Xây Dựng Hà Nội
              </Text>
            </View>
            <Entypo name='chevron-right' size={24} color='black' />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#00aa12',
                  padding: 10,
                  borderRadius: 100,
                }}
              >
                <Image
                  source={require('@/assets/images/bike_white.png')}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }}
                />
              </View>
              <Text style={{ marginLeft: 10, width: '75%' }} numberOfLines={1}>
                55 Đ. Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Việt Nam
              </Text>
            </View>
            <Entypo name='chevron-right' size={24} color='black' />
          </View>
        </View>

        <Text
          style={{
            paddingTop: 16,
            paddingBottom: 10,
            fontSize: 20,
            fontWeight: '600',
          }}
        >
          Ưu đãi
        </Text>
        <View>
          <Image
            source={require('@/assets/images/banner1.png')}
            style={{
              height: 200,
              width: '100%',
              resizeMode: 'cover',
              borderRadius: 20,
            }}
          ></Image>
        </View>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  topBarContainer: {
    // flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#006C02',
  },
  seachInput: {
    height: 48,
    width: '85%',
    marginVertical: 10,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  },
  bodyContainer: {
    paddingHorizontal: 16,
  },
})
