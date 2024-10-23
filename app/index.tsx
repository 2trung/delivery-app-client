import { useEffect, useRef, useState } from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native'
import { CountryPicker } from 'react-native-country-codes-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import useAuth from '../store/authSlice'
import { icons, images } from '../constants'

const Index = () => {
  const router = useRouter()
  const inputRef = useRef<TextInput>(null)
  const [inputPhoneNumber, setInputPhoneNumber] = useState('')
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false)
  const { checkPhoneNumber, loading } = useAuth()

  const handleInputPhoneNumber = async () => {
    if (!validatePhoneNumber(inputPhoneNumber)) return
    if (loading) return
    let validPhoneNumber
    if (inputPhoneNumber.startsWith('0'))
      validPhoneNumber = '84' + inputPhoneNumber.slice(1)
    else validPhoneNumber = '84' + inputPhoneNumber
    const response = await checkPhoneNumber(validPhoneNumber)
    if (response.data.existingUser) router.push('/(auth)/Login')
    else
      router.push({
        pathname: '/(auth)/InputOtp',
        params: { nextAction: 'register' },
      })
  }

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneNumberRegex = /^0?[35789][0-9]{8}$/
    return phoneNumberRegex.test(phoneNumber)
  }
  useEffect(() => {
    setIsValidPhoneNumber(validatePhoneNumber(inputPhoneNumber))
  }, [inputPhoneNumber])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nhập số điện thoại của bạn</Text>
      <Text style={styles.heading1}>Đăng nhập/Đăng ký</Text>

      <View style={styles.phoneInputContainer}>
        <TouchableOpacity style={styles.phoneCountryCode}>
          <Text>+84</Text>
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.phoneInput}
          keyboardType='number-pad'
          cursorColor={'black'}
          placeholder='987654321'
          placeholderTextColor={'#999'}
          onFocus={() =>
            inputRef.current &&
            inputRef.current.setNativeProps({
              style: { borderColor: '#3DB24B' },
            })
          }
          onBlur={() =>
            inputRef.current &&
            inputRef.current.setNativeProps({
              style: { borderColor: '#dfdfdf' },
            })
          }
          onChangeText={(value) => setInputPhoneNumber(value)}
        />
      </View>
      {/* {error && (
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
      )} */}

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={isValidPhoneNumber ? false : true}
        style={
          isValidPhoneNumber
            ? styles.countinueButton
            : styles.countinueButtonDisable
        }
        onPress={() => handleInputPhoneNumber()}
      >
        {loading ? (
          <ActivityIndicator color='white' />
        ) : (
          <Text
            style={
              isValidPhoneNumber
                ? styles.countinueButtonText
                : styles.countinueButtonTextDisable
            }
          >
            Tiếp tục
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Hoặc</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialLoginButton}>
          <Image style={{ height: 18, width: 18 }} source={icons.google} />
          <Text style={styles.socialLoginButtonText}>Đăng nhập với Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialLoginButton}>
          <Image style={{ height: 18, width: 18 }} source={icons.facebook} />
          <Text style={styles.socialLoginButtonText}>
            Đăng nhập với Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  heading1: {
    paddingVertical: 5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginTop: 50,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    paddingVertical: 8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  phoneCountryCode: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  countinueButton: {
    backgroundColor: '#3DB24B',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 30,
  },
  countinueButtonDisable: {
    backgroundColor: '#e1e3e9',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 30,
  },
  countinueButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  countinueButtonTextDisable: {
    color: '#989ca7',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 0.7,
    backgroundColor: '#dfdfdf',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    // fontWeight: 'bold',
  },
  socialLoginContainer: {
    gap: 10,
    paddingVertical: 30,
  },
  socialLoginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f3f5f7',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  socialLoginButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
})
