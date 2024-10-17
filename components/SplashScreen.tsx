import { View, Image, StyleSheet } from 'react-native'

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('@/assets/images/splash.png')}
      ></Image>
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
