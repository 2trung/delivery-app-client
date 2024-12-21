import { Skeleton } from 'moti/skeleton'
import { View } from 'react-native'

const FoodSkeleton = () => {
  return (
    <View style={{ paddingHorizontal: 16, gap: 20 }}>
      <Skeleton colorMode='light' height={16} width={120} radius='square' />
      <View style={{ flexDirection: 'row', gap: 35 }}>
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Skeleton colorMode='light' height={70} width={70} radius='round' />
          <Skeleton colorMode='light' height={16} width={50} radius='square' />
        </View>
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Skeleton colorMode='light' height={70} width={70} radius='round' />
          <Skeleton colorMode='light' height={16} width={50} radius='square' />
        </View>
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Skeleton colorMode='light' height={70} width={70} radius='round' />
          <Skeleton colorMode='light' height={16} width={50} radius='square' />
        </View>
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Skeleton colorMode='light' height={70} width={70} radius='round' />
          <Skeleton colorMode='light' height={16} width={50} radius='square' />
        </View>
      </View>

      <Skeleton colorMode='light' height={16} width={120} radius='square' />
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Skeleton colorMode='light' height={260} width={170} radius='square' />
        <Skeleton colorMode='light' height={260} width={170} radius='square' />
      </View>
      <Skeleton colorMode='light' height={16} width={120} radius='square' />
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Skeleton colorMode='light' height={140} width={310} radius='square' />
        <Skeleton colorMode='light' height={140} width={310} radius='square' />
      </View>
    </View>
  )
}

export default FoodSkeleton
