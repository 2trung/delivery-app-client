import { FontAwesome6 } from '@expo/vector-icons'
import { TouchableOpacity, StyleSheet } from 'react-native'
interface CheckboxProps {
  onChange: () => void
  checked: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({ onChange, checked }) => {
  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, checked && styles.checked]}
      onPress={onChange}
    >
      {checked && <FontAwesome6 name='check' size={14} color='#fff' />}
    </TouchableOpacity>
  )
}
export default Checkbox

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#494a4a',
    justifyContent: 'center',
    borderRadius: 6,
  },
  checked: {
    backgroundColor: '#00880c',
    borderWidth: 0,
  },
  checkmark: {
    color: '#fff',
  },
})
