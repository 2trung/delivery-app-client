import { AntDesign } from '@expo/vector-icons'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native'
import useUser from '@/store/userSlice'
import { Avatar } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import { useState, useEffect } from 'react'
import { updateUser } from '@/api/userAPI'
import { useMutation } from '@tanstack/react-query'

const EditProfileModal = ({ closeModal }: { closeModal: () => void }) => {
  const { user, setUser } = useUser()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [imageFile, setImageFile] = useState<any | undefined>(undefined)

  const { data, isPending, mutate } = useMutation({
    mutationFn: () => updateUser(name ?? '', email, imageFile ?? undefined),
    onSuccess: (data) => {
      setUser(data.data as any)
      closeModal()
    },
    onError: (e) => {
      console.log(e)
      Alert.alert('Cập nhật thất bại')
    },
  })
  const handleUpdate = () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/
      return emailRegex.test(email)
    }
    if (!name) return Alert.alert('Vui lòng nhập tên')
    if (email && !isValidEmail(email)) return Alert.alert('Email không hợp lệ')
    mutate()
  }
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      alert('Permission to access media library is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setImageFile({
        uri: result.assets[0].uri,
        name: 'avatar.jpg',
        type: 'image/jpg',
      })
    }
  }
  return (
    <Modal>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => closeModal()}
            style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
          >
            <AntDesign name='arrowleft' size={24} color='black' />
            <Text style={{ fontSize: 18, fontWeight: '500' }}>
              Chỉnh sửa hồ sơ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: isPending ? '#f0f0f0' : '#00880c',
              borderRadius: 20,
            }}
            onPress={() => handleUpdate()}
            disabled={isPending}
          >
            <Text
              style={{
                color: isPending ? '#717171' : '#fff',
                paddingHorizontal: 20,
                paddingVertical: 8,
                fontWeight: '600',
              }}
            >
              Lưu
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignSelf: 'center', gap: 5, alignItems: 'center' }}>
          <Text style={{ fontWeight: '500' }}>Ảnh đại diện</Text>
          {selectedImage ? (
            <Avatar.Image
              size={70}
              source={{
                uri: selectedImage,
              }}
            />
          ) : user?.avatar ? (
            <Avatar.Image
              size={70}
              source={{
                uri: `data:image/png;base64,${user.avatar}`,
              }}
            />
          ) : (
            <Avatar.Text size={70} label={user?.name[0] ?? 'A'} />
          )}

          <Pressable onPress={() => pickImage()}>
            <Text style={{ fontWeight: '300' }}>Thêm ảnh</Text>
          </Pressable>
        </View>

        <View style={{ gap: 20 }}>
          <View>
            <Text style={{ color: '#494b4a', fontWeight: '500' }}>
              Tên
              <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <TextInput
              placeholder={'Nhập tên của bạn'}
              placeholderTextColor={'#8E8E8E'}
              cursorColor={'#000'}
              style={styles.textInput}
              onChangeText={(text) => setName(text)}
              value={name}
            />
          </View>

          <View>
            <Text style={{ color: '#494b4a', fontWeight: '500' }}>
              Số điện thoại <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <Text
                style={{ color: '#494b4a', fontWeight: '500', fontSize: 18 }}
              >
                +84
              </Text>
              <TextInput
                placeholder='Nhập số điện thoại'
                placeholderTextColor={'#8E8E8E'}
                keyboardType='phone-pad'
                cursorColor={'#000'}
                style={{ flex: 1, ...styles.textInput }}
                onChangeText={(text) => {}}
                value={user?.phoneNumber.split('+84')[1]}
                editable={false}
              />
            </View>
          </View>

          <View>
            <Text style={{ color: '#494b4a', fontWeight: '500' }}>Email</Text>
            <TextInput
              placeholder={'Nhập tên địa chỉ email'}
              placeholderTextColor={'#8E8E8E'}
              cursorColor={'#000'}
              style={styles.textInput}
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default EditProfileModal

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 5,
  },
})
