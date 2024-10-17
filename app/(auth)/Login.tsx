import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper'
import { useEffect, useState } from 'react'
import useAuth from '@/store/authSlice'
import useUser from '@/store/userSlice'

const Login = () => {
  const router = useRouter()
  const { login, error, loading, phoneNumber, forgotPassword } = useAuth()
  const { getUser } = useUser()
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      }
    )

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      }
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(phoneNumber)
      router.push({
        pathname: '/(auth)/InputOtp',
        params: { nextAction: 'resetPassword' },
      })
    } catch (error: any) {
      // console.log(error)
    }
  }
  const handleLogin = async () => {
    try {
      await login(phoneNumber, password)
      await getUser()
      router.replace('/(home)/')
    } catch (error: any) {
      // console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.title}>Đăng nhập tài khoản</Text>
        <Text>Hãy nhập mật khẩu để đăng nhâp tài khoản của bạn.</Text>
      </View>
      <View>
        <TextInput
          style={{ ...styles.input, backgroundColor: '#f9f9f9' }}
          label='Số điện thoại'
          value={'+' + phoneNumber}
          keyboardType='number-pad'
          mode='outlined'
          outlineColor='#dddee5'
          activeOutlineColor={'#3DB24B'}
          theme={{ roundness: 10 }}
          editable={false}
        />

        <TextInput
          style={styles.input}
          value={password}
          label='Mật khẩu'
          placeholderTextColor='#999'
          keyboardType='default'
          secureTextEntry={isShowPassword ? false : true}
          cursorColor={'black'}
          mode='outlined'
          outlineColor='#dddee5'
          activeOutlineColor={'#3DB24B'}
          theme={{ roundness: 10 }}
          right={
            isPasswordFocused &&
            (isShowPassword ? (
              <TextInput.Icon
                icon='eye'
                size={16}
                onPress={() => setIsShowPassword(false)}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                size={16}
                onPress={() => setIsShowPassword(true)}
              />
            ))
          }
          onChangeText={(value) => setPassword(value)}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
      </View>
      {error && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            marginTop: 5,
          }}
        >
          <Ionicons name='warning' size={16} color='#d30000' />
          <Text
            style={{
              color: '#d30000',
            }}
          >
            {error}
          </Text>
        </View>
      )}
      <View style={{ marginVertical: 10, alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => handleForgotPassword()}>
          <Text style={{ color: '#3DB24B' }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.submitButton}
          onPress={() => handleLogin()}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Đăng nhập
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {!keyboardVisible && (
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
          <Text
            style={{
              textAlign: 'center',
            }}
          >
            Bằng việc ấn Đăng nhập, tôi xác nhận đã đọc và đồng ý với các{' '}
            <Text
              style={{
                color: '#3DB24B',
                textDecorationLine: 'underline',
              }}
            >
              Chính sách bảo mật và Điều khoản hoạt động
            </Text>
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Login
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    marginTop: 10,
    borderBottomWidth: 0,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#3DB24B',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
