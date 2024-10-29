import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { forwardRef, useMemo } from 'react'
import { View, Text } from 'react-native'

export type Ref = BottomSheetModal
const CustomBottomSheet = forwardRef<Ref>((prop, ref) => {
  const snapPoints = useMemo(() => ['50%'], [])
  return (
    <BottomSheetModal snapPoints={snapPoints}>
      <View>
        <Text>Test</Text>
      </View>
    </BottomSheetModal>
  )
})

export default CustomBottomSheet
