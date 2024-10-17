import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper'
import { useEffect, useState } from 'react'
import useAuth from '@/store/authSlice'

type InputTypes = 'password' | 'rePassword'
const ResetPassword = () => {
  const router = useRouter()
  const { phoneNumber, resetPassword, otp, error, loading } = useAuth()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowRePassword, setIsShowRePassword] = useState(false)
  const [isMatch, setIsMatch] = useState(true)

  const [inputs, setInputs] = useState({
    password: '',
    rePassword: '',
  })
  const [focusStates, setFocusStates] = useState({
    password: false,
    rePassword: false,
  })

  const handleChange = (inputName: InputTypes, value: string) => {
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

  const handelSubmit = async () => {
    try {
      if (inputs.password !== inputs.rePassword) {
        setIsMatch(false)
        return
      }
      await resetPassword(phoneNumber, inputs.password, otp)
      router.replace('/(auth)/Login')
    } catch (error: any) {
      // console.log(error)
    }
  }

  useEffect(() => {
    setIsMatch(true)
  }, [inputs])

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <Text>Hãy điền mật khẩu mới và xác nhận.</Text>
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
          value={inputs.password}
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

        <TextInput
          style={styles.input}
          value={inputs.rePassword}
          label='Xác nhận mật khẩu'
          placeholderTextColor='#999'
          keyboardType='default'
          secureTextEntry={isShowRePassword ? false : true}
          cursorColor={'black'}
          mode='outlined'
          outlineColor='#dddee5'
          activeOutlineColor={'#3DB24B'}
          theme={{ roundness: 10 }}
          right={
            focusStates.rePassword &&
            (isShowRePassword ? (
              <TextInput.Icon
                icon='eye'
                size={16}
                onPress={() => setIsShowRePassword(false)}
              />
            ) : (
              <TextInput.Icon
                icon='eye-off'
                size={16}
                onPress={() => setIsShowRePassword(true)}
              />
            ))
          }
          onChangeText={(value) => handleChange('rePassword', value)}
          onFocus={() => handleFocus('rePassword')}
          onBlur={() => handleBlur('rePassword')}
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

      {!isMatch && (
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
            Mật khẩu không khớp
          </Text>
        </View>
      )}

      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.submitButton}
          onPress={() => handelSubmit()}
        >
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              Xác nhận
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ResetPassword
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
