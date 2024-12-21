import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome, Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { icons, images } from '@/constants'
import useUser from '@/store/userSlice'
import { useQuery } from '@tanstack/react-query'
import { getAllOrders } from '@/api/orderAPI'
import { OrderType } from '@/types/type'
const { width: viewportWidth } = Dimensions.get('window')

const carouselImages = [{ source: images.banner1 }, { source: images.banner2 }]

const renderItem = ({ item }: { item: { source: any } }) => (
  <Image
    source={item.source}
    style={{
      height: 200,
      width: 355,
      resizeMode: 'cover',
      borderRadius: 20,
    }}
  />
)
const Home = () => {
  const route = useRouter()
  const [greeting, setGreeting] = useState('')
  const { user } = useUser()
  const { data, isPending } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getAllOrders(2, 1),
  })
  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours()

      if (currentHour >= 5 && currentHour < 10) {
        setGreeting('Chào buổi sáng,')
      } else if (currentHour >= 10 && currentHour < 14) {
        setGreeting('Chào buổi trưa,')
      } else if (currentHour >= 14 && currentHour < 18) {
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
            {user?.name}
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
          <TouchableOpacity onPress={() => route.push('/ride/SelectLocation')}>
            <View
              style={{
                backgroundColor: '#E5F9D4',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.bike}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Đặt xe</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => route.push('/food')}>
            <View
              style={{
                backgroundColor: '#FAE3E2',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.food}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Đồ ăn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => route.push('/delivery/FillDeliveryDetail')}
          >
            <View
              style={{
                backgroundColor: '#D8F2F9',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Image
                source={icons.packageIcon}
                style={{ height: 50, width: 50, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 5 }}>Giao hàng</Text>
          </TouchableOpacity>
        </View>
        {data?.content && (
          <>
            <Text
              style={{
                paddingTop: 16,
                paddingBottom: 20,
                fontSize: 20,
                fontWeight: '600',
              }}
            >
              Chuyến xe gần đây
            </Text>
            <View style={{ gap: 10 }}>
              {data.content.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
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
                      // height: 50,
                      // width: 50,
                      padding: 10,
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
                      style={{ height: 20, width: 20, resizeMode: 'contain' }}
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
                    </View>
                  </View>
                  <Entypo name='chevron-right' size={24} color='black' />
                </View>
              ))}
            </View>
          </>
        )}

        {/* 
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
                  source={icons.bikeWhite}
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
                  source={icons.bikeWhite}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }}
                />
              </View>
              <Text style={{ marginLeft: 10, width: '75%' }} numberOfLines={1}>
                55 Đ. Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Việt Nam
              </Text>
            </View>
            <Entypo name='chevron-right' size={24} color='black' />
          </View>
        </View> */}

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
        <FlatList
          data={carouselImages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          contentContainerStyle={{ gap: 10 }}
          showsHorizontalScrollIndicator={false}
        />
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
})
