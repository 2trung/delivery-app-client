import { View, StyleSheet, Pressable, Text } from 'react-native'

interface RadioButtonProps {
  checked: boolean
  label: string
  onChange: () => void
}

const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <Pressable onPress={onChange} style={styles.container}>
      <View style={[styles.radioButtonContainer, checked && styles.checked]}>
        {checked && <View style={styles.dot} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 3,
  },
  label: { flexShrink: 1, fontWeight: '500' },
  radioButtonContainer: {
    // flexDirection: 'row',
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
