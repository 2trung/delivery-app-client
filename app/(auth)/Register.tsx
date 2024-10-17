import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import useAuth from '@/store/authSlice'

type InputTypes = 'fullName' | 'email' | 'password'

const Register = () => {
  const router = useRouter()
  const { phoneNumber, register, error, otp, loading } = useAuth()
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [isShowPassword, setIsShowPassword] = useState(false)

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

  const [inputs, setInputs] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const [focusStates, setFocusStates] = useState({
    fullName: false,
    email: false,
    password: false,
  })

  const handleChange = (inputName: InputTypes, value: String) => {
    setInputs({
      ...inputs,
      [inputName]: value,
    })
  }

  const handleFocus = (inputName: InputTypes) => {
    setFocusStates({
      ...focusStates,
      [inputName]: true,
    })
  }

  const handleBlur = (inputName: InputTypes) => {
    setFocusStates({
      ...focusStates,
      [inputName]: false,
    })
  }

  const handleClear = (inputName: InputTypes) => {
    handleChange(inputName, '')
  }

  const handleRegister = async () => {
    try {
      await register(
        phoneNumber,
        inputs.password,
        inputs.fullName,
        inputs.email,
        otp
      )
      router.navigate('/(auth)/Login')
    } catch (error) {
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
        <Text style={styles.title}>Đăng ký tài khoản</Text>
        <Text>Hãy điền các thông tin sau để tạo tài khoản.</Text>
      </View>

      <View>
        <TextInput
          style={{ ...styles.input, backgroundColor: '#f9f9f9' }}
          label={
            <Text>
              Số điện thoại<Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
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
          value={inputs.fullName}
          label={
            <Text>
              Họ và tên<Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
          placeholder='Ví dụ: Nguyen Van A'
          placeholderTextColor='#999'
          keyboardType='default'
          cursorColor={'black'}
          mode='outlined'
          outlineColor='#dddee5'
          activeOutlineColor={'#3DB24B'}
          theme={{ roundness: 10 }}
          right={
            inputs.fullName &&
            focusStates.fullName && (
              <TextInput.Icon
                icon='close'
                size={16}
                onPress={() => handleClear('fullName')}
              />
            )
          }
          onChangeText={(value) => handleChange('fullName', value)}
          onFocus={() => handleFocus('fullName')}
          onBlur={() => handleBlur('fullName')}
        />

        <TextInput
          style={styles.input}
          label='Email'
          placeholder='Ví dụ: john.doe@email.com'
          placeholderTextColor='#999'
          value={inputs.email}
          keyboardType='email-address'
          cursorColor={'black'}
          mode='outlined'
          outlineColor='#dddee5'
          activeOutlineColor={'#3DB24B'}
          theme={{ roundness: 10 }}
          right={
            inputs.email &&
            focusStates.email && (
              <TextInput.Icon
                icon='close'
                size={16}
                onPress={() => handleClear('email')}
              />
            )
          }
          onChangeText={(value) => handleChange('email', value)}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
        />
        <TextInput
          style={styles.input}
          value={inputs.password}
          label={
            <Text>
              Mật khẩu<Text style={{ color: 'red' }}>*</Text>
            </Text>
          }
          placeholderTextColor='#999'
          keyboardType='default'
          secureTextEntry={isShowPassword ? false : true}
          cursorColor={'black'}
          mode='outlined'
          outlineColor='#dddee5'
          activeOutlineColor={'#3DB24B'}
          theme={{ roundness: 10 }}
          right={
            focusStates.password &&
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
          onChangeText={(value) => handleChange('password', value)}
          onFocus={() => handleFocus('password')}
          onBlur={() => handleBlur('password')}
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

      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.submitButton}
          onPress={() => handleRegister()}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Đăng ký
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {!keyboardVisible && (
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>
            Bằng việc ấn Đăng ký, tôi xác nhận đã đọc và đồng ý với các{' '}
            <Text style={{ color: '#3DB24B', textDecorationLine: 'underline' }}>
              Chính sách bảo mật và Điều khoản hoạt động
            </Text>
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Register
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
    // height: 48,
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
})
