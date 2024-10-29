import { FontAwesome6 } from '@expo/vector-icons'
import { Pressable, StyleSheet, View, Text } from 'react-native'
interface CheckboxProps {
  onChange: () => void
  label: string
  checked: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({ onChange, checked, label }) => {
  return (
    <Pressable onPress={onChange} style={styles.container}>
      <View style={[styles.checkboxContainer, checked && styles.checked]}>
        {checked && <FontAwesome6 name='check' size={14} color='#fff' />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}
export default Checkbox

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 3,
  },
  label: { flexShrink: 1, fontWeight: '500' },
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
