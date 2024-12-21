import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import RadioButton from './RadioButton'
import useDeliveryStore from '@/store/deliverySlice'
import { Weight } from '@/types/type'
import { Ionicons } from '@expo/vector-icons'

const ChooseWeight = ({
  handleCloseWeightModal,
}: {
  handleCloseWeightModal: (weight: Weight | null) => void
}) => {
  const { weight } = useDeliveryStore()
  return (
    <Modal transparent={true} animationType='none' statusBarTranslucent>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => handleCloseWeightModal(null)}
        >
          <Ionicons name='close' size={32} color='black' />
        </TouchableOpacity>
        <View style={styles.modalContainer}>
          <View>
            <Text
              style={{ fontSize: 18, fontWeight: '600', paddingVertical: 10 }}
            >
              Kích thước gói hàng của bạn
            </Text>
            <Text style={{ fontWeight: '400', color: '#2F2828' }}>
              Điều này sẽ giúp tài xế chuẩn bị & xử lý gói hàng của bạn tốt hơn
            </Text>
          </View>
          <View style={{ gap: 20 }}>
            <TouchableOpacity
              style={styles.weightContainer}
              onPress={() => handleCloseWeightModal(Weight.SMALL)}
            >
              <Text style={styles.weightTitle}>Nhỏ</Text>
              <View style={styles.radioButtonContainer}>
                <Text style={styles.maxWeight}>Tối đa 5KG</Text>
                <RadioButton
                  checked={weight === Weight.SMALL}
                  onChange={() => handleCloseWeightModal(Weight.SMALL)}
                  label={''}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weightContainer}
              onPress={() => handleCloseWeightModal(Weight.MEDIUM)}
            >
              <Text style={styles.weightTitle}>Trung bình</Text>
              <View style={styles.radioButtonContainer}>
                <Text style={styles.maxWeight}>Tối đa 20KG</Text>
                <RadioButton
                  checked={weight === Weight.MEDIUM}
                  onChange={() => handleCloseWeightModal(Weight.MEDIUM)}
                  label={''}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weightContainer}
              onPress={() => handleCloseWeightModal(Weight.LARGE)}
            >
              <Text style={styles.weightTitle}>Lớn</Text>
              <View style={styles.radioButtonContainer}>
                <Text style={styles.maxWeight}>Tối đa 100KG</Text>
                <RadioButton
                  checked={weight === Weight.LARGE}
                  onChange={() => handleCloseWeightModal(Weight.LARGE)}
                  label={''}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ChooseWeight

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    gap: 20,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    gap: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
  buttonTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  weightContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'space-between',
    padding: 16,
    paddingRight: 6,
    borderColor: '#E5E5E5',
  },
  weightTitle: { fontSize: 18, fontWeight: '500' },
  maxWeight: { fontSize: 18, fontWeight: '500', color: '#646363' },
  radioButtonContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  closeButton: {
    height: 45,
    width: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    alignSelf: 'flex-end',
    marginHorizontal: 10,
  },
})
