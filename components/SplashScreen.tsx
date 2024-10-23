import { View, Image, StyleSheet } from 'react-native'
import { images } from '@/constants'

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={images.splash}></Image>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5eada',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
})
