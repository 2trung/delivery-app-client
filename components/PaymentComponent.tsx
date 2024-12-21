import usePaymentMethod from '@/store/paymentMethodSlice'
import { PaymentMethod } from '@/types/type'
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'
import {
  Pressable,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'

const PaymentComponent = ({
  buttonTitle,
  isPending,
  onSetPaymentMethod,
  onConfirm,
}: {
  buttonTitle: string
  isPending: boolean
  onSetPaymentMethod: () => void
  onConfirm: () => void
}) => {
  const { paymentMethod, card } = usePaymentMethod()
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          style={styles.additionButton}
          onPress={() => onSetPaymentMethod()}
        >
          {paymentMethod === PaymentMethod.CASH ? (
            <MaterialCommunityIcons
              name='cash-multiple'
              size={20}
              color='#0aafd9'
            />
          ) : (
            <FontAwesome
              name={card?.brand === 'visa' ? 'cc-visa' : 'cc-mastercard'}
              size={20}
              color={card?.brand === 'visa' ? '#1A1F71' : '#FF5F00'}
            />
          )}

          <Text style={{ fontWeight: '600' }}>
            {paymentMethod === PaymentMethod.CASH
              ? 'Tiền mặt'
              : `${card?.brand.toUpperCase()}*${card?.last4}`}
          </Text>
          <Entypo name='chevron-down' size={16} color='black' />
        </Pressable>
        <TouchableOpacity style={styles.additionButton}>
          <MaterialIcons name='discount' size={16} color='#dc3f3d' />
          <Text style={{ fontWeight: '600' }}>Voucher</Text>
          <Entypo name='chevron-right' size={16} color='black' />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => onConfirm()}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
          {isPending ? (
            <ActivityIndicator
              size='small'
              color='#fff'
              style={{ paddingVertical: 2 }}
            />
          ) : (
            buttonTitle
          )}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default PaymentComponent

const styles = StyleSheet.create({
  additionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5,
    marginVertical: 5,
  },
  confirmButton: {
    backgroundColor: '#009112',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 10,
    gap: 10,
  },
})
