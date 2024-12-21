import React from 'react'
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native'
import RadioButton from './RadioButton'
import { useStripe } from '@stripe/stripe-react-native'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  setupIntent as setupIntentAPI,
  getPaymentMethods,
} from '@/api/paymentAPI'
import usePaymentMethod from '@/store/paymentMethodSlice'
import { PaymentMethod } from '@/types/type'
import { useRef } from 'react'

const PaymentMethodBottomSheet = ({ onClose }: { onClose: () => void }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const { setPaymentMethod, paymentMethod, card } = usePaymentMethod()
  const bottomSheetModalRef = useRef<BottomSheet>(null)

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethods,
  })

  const { isPending, mutate: setupIntent } = useMutation({
    mutationFn: setupIntentAPI,
    onSuccess: async (data) => {
      await initPaymentSheet({
        setupIntentClientSecret: data.clientSecret,
        merchantDisplayName: 'Delivery, Inc.',
      })
      openPaymentSheet()
    },
  })

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()
    if (error) {
      Alert.alert('Thêm thẻ thất bại')
    } else {
      refetch()
      // resetCart();
      // router.replace('/');
    }
  }

  const onChangePaymentMethod = (method: PaymentMethod, card?: any) => {
    setPaymentMethod(method, card)
    bottomSheetModalRef.current?.close()
  }
  return (
    <>
      <BottomSheet
        snapPoints={['90%']}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        onClose={() => onClose()}
        backdropComponent={() => <View style={styles.backdrop} />}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView collapsable={false} style={styles.contentContainer}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '500' }}>
              Chọn phương thức thanh toán
            </Text>
            <Text style={{ fontSize: 14 }}>
              Chọn phương thức thanh toán phù hợp với bạn
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.cardsContainer}>
            <Pressable
              style={styles.paymentMethodContainer}
              onPress={() => onChangePaymentMethod(PaymentMethod.CASH)}
            >
              <View style={styles.paymentTitleContainer}>
                <MaterialCommunityIcons
                  name='cash-multiple'
                  size={24}
                  color='#0aafd9'
                />
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  Thanh toán bằng tiền mặt
                </Text>
              </View>
              <RadioButton
                checked={paymentMethod === 'CASH'}
                label=''
                onChange={() => onChangePaymentMethod(PaymentMethod.CASH)}
              />
            </Pressable>
            {isLoading && <ActivityIndicator size='large' color='#000' />}

            {data?.map((c) => (
              <Pressable
                style={styles.paymentMethodContainer}
                key={c.id}
                onPress={() =>
                  onChangePaymentMethod(PaymentMethod.CREDIT_CARD, c)
                }
              >
                <View style={styles.paymentTitleContainer}>
                  <FontAwesome
                    name={c.brand === 'visa' ? 'cc-visa' : 'cc-mastercard'}
                    size={24}
                    color={c.brand === 'visa' ? '#1A1F71' : '#FF5F00'}
                  />
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {c.brand === 'visa' ? 'VISA' : 'MASTERCARD'}*{c.last4}
                  </Text>
                </View>
                <RadioButton
                  checked={paymentMethod === 'CREDIT_CARD' && c.id === card?.id}
                  label=''
                  onChange={() =>
                    onChangePaymentMethod(PaymentMethod.CREDIT_CARD, c)
                  }
                />
              </Pressable>
            ))}

            <Pressable
              style={styles.paymentMethodContainer}
              onPress={() => setupIntent()}
              disabled={isPending}
            >
              <View style={styles.paymentTitleContainer}>
                <Ionicons name='card' size={24} color='#DC3F3D' />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    Thêm thẻ tín dụng hoặc ghi nợ
                  </Text>
                  <Text style={{ fontWeight: '300', fontSize: 12 }}>
                    Thẻ Visa, Mastercard, AMEX và JCB
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#009112',
                  marginRight: 13,
                  borderRadius: 20,
                }}
              >
                <Entypo name='plus' size={20} color='#fff' />
              </View>
            </Pressable>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
      {isPending && (
        <View style={styles.overlay}>
          <ActivityIndicator size='large' color='#ffffff' />
        </View>
      )}
    </>
  )
}

export default PaymentMethodBottomSheet

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    // paddingVertical: 20,
    backgroundColor: 'white',
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardsContainer: { gap: 20, paddingVertical: 20 },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
