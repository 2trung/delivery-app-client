import { AntDesign } from '@expo/vector-icons'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

const BackButton = () => {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}>
        <AntDesign name='arrowleft' size={24} color='black' />
      </TouchableOpacity>
    </View>
  )
}

export default BackButton

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
  button: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 100,
    elevation: 10,
  },
})
