import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { OTPInput } from '@/components/OTPInput'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import useAuth from '@/store/authSlice'

const InputOtp = () => {
  const router = useRouter()
  const { nextAction } = useLocalSearchParams<{
    nextAction: 'register' | 'resetPassword'
  }>()
  const { phoneNumber, verifyOtp, resendOtp } = useAuth()
  const [codes, setCodes] = useState<string[] | undefined>(Array(4).fill(''))
  const [errorMessages, setErrorMessages] = useState<string[]>()
  const [reSendTime, setReSendTime] = useState<number>(60)
  const [loading, setLoading] = useState(false)
  const refs: RefObject<TextInput>[] = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (reSendTime === 0) {
        clearInterval(interval)
        return
      }
      setReSendTime(reSendTime - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [reSendTime])

  const handleResendOtp = async () => {
    setLoading(true)
    await resendOtp(phoneNumber)
    setReSendTime(60)
    setLoading(false)
  }
  const handleVerify = async () => {
    setLoading(true)
    const validCode = codes?.join('')
    if (validCode?.length !== 4) return
    try {
      await verifyOtp(phoneNumber, validCode)
      if (nextAction === 'resetPassword')
        router.replace('/(auth)/ResetPassword')
      else router.replace('/(auth)/Register')
    } catch (error: any) {
      setErrorMessages(['Mã OTP không chính xác'])
    } finally {
      setLoading(false)
    }
  }
  const onChangeCode = (text: string, index: number) => {
    if (text.length > 1) {
      setErrorMessages(undefined)
      const newCodes = text.split('')
      setCodes(newCodes)
      refs[3]!.current?.focus()
      return
    }
    setErrorMessages(undefined)
    const newCodes = [...codes!]
    newCodes[index] = text
    setCodes(newCodes)
    if (text !== '' && index < 4) {
      refs[index + 1]!.current?.focus()
    }
  }
  useEffect(() => {
    if (codes?.join('').length === 4) handleVerify()
  }, [codes])
  return (
    <>
      <Modal transparent={true} animationType='none' visible={loading}>
        <View style={styles.overlay}>
          <ActivityIndicator size='large' color='#ffffff' />
        </View>
      </Modal>
      <SafeAreaView style={styles.container}>
        {/* Back button */}
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name='chevron-back' size={24} color='black' />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.title}>Xác thực OTP</Text>
          <Text>
            Nhập mã gồm 4 chữ số đã được gửi đến số điện thoại{' '}
            <Text style={{ fontWeight: 'bold' }}>+{phoneNumber}</Text>
          </Text>
        </View>

        {/* Otp input */}
        <View style={styles.otpInputContainer}>
          <OTPInput
            codes={codes!}
            errorMessages={errorMessages}
            onChangeCode={onChangeCode}
            refs={refs}
            config={{
              backgroundColor: '#fff',
              textColor: 'black',
              borderColor: '#dfdfdf',
              errorColor: 'red',
              focusColor: '#3DB24B',
            }}
          />
          {errorMessages && (
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
                {errorMessages}
              </Text>
            </View>
          )}
        </View>

        <View>
          <Text style={{ marginBottom: 10, fontWeight: '500' }}>
            Bạn không nhận được mã?
          </Text>
          {reSendTime === 0 ? (
            <TouchableOpacity onPress={() => handleResendOtp()}>
              <Text style={{ color: '#3DB24B' }}>Gửi lại mã OTP</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#838383' }}>
              Gửi lại mã sau{' '}
              <Text style={{ color: '#3DB24B' }}>
                {reSendTime}
                {'s'}
              </Text>
            </Text>
          )}
        </View>
      </SafeAreaView>
    </>
  )
}

export default InputOtp

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 50,
    marginBottom: 10,
  },
  otpInputContainer: {
    marginVertical: 50,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
