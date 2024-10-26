import { View, TouchableOpacity, StyleSheet } from 'react-native'

interface RadioButtonProps {
  checked: boolean
  onChange: () => void
}

const RadioButton: React.FC<RadioButtonProps> = ({ checked, onChange }) => {
  return (
    <TouchableOpacity
      style={[styles.radioButtonContainer, checked && styles.checked]}
      onPress={onChange}
    >
      {checked && <View style={styles.dot} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#494a4a',
    borderRadius: 10,
    justifyContent: 'center',
  },
  checked: {
    borderColor: '#00880c',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00880c',
  },
})

export default RadioButton
