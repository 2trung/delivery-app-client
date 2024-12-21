import { View, Text, StyleSheet, Pressable } from 'react-native'
import useAuth from '@/store/authSlice'
import useUser from '@/store/userSlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import EditProfileModal from '@/components/EditProfileModal'
import { StatusBar } from 'expo-status-bar'
import { Avatar } from 'react-native-paper'

const User = () => {
  const { removeAuth } = useAuth()
  const { user } = useUser()
  const [isShowEditProfile, setIsShowEditProfile] = useState(false)
  return (
    <SafeAreaView style={styles.container}>
      {isShowEditProfile && (
        <EditProfileModal closeModal={() => setIsShowEditProfile(false)} />
      )}
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View
          style={{
            borderColor: '#00880c',
            borderWidth: 2,
            padding: 2,
            borderRadius: 100,
            alignSelf: 'center',
          }}
        >
          {user?.avatar ? (
            <Avatar.Image
              size={50}
              source={{
                uri: `data:image/png;base64,${user.avatar}`,
              }}
            />
          ) : (
            <Avatar.Text size={50} label={user?.name[0] ?? 'A'} />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>
              {user?.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {user?.email ? user.email : 'Chưa thêm email'}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              {user?.phoneNumber}
            </Text>
          </View>
          <Pressable onPress={() => setIsShowEditProfile(true)}>
            <MaterialIcons name='mode-edit' size={20} color='black' />
          </Pressable>
        </View>
      </View>
      <View style={{ paddingTop: 30 }}>
        <Text style={{ fontWeight: '500', color: '#2F2828' }}>Tài khoản</Text>
        <View style={styles.optionContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name='document-text' size={24} color='#2F2828' />
            <Text style={styles.optionTitle}>Lịch sử đơn hàng</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </View>
        <View style={styles.optionContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <MaterialIcons name='discount' size={24} color='#2F2828' />
            <Text style={styles.optionTitle}>Ưu đãi</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </View>
        <View style={styles.optionContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name='chatbubbles' size={24} color='#2F2828' />
            <Text style={styles.optionTitle}>Trung tâm hỗ trợ</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </View>

        <View style={styles.optionContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name='accessibility' size={24} color='#2F2828' />
            <Text style={styles.optionTitle}>Trợ năng</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </View>

        <View style={styles.optionContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name='notifications' size={24} color='#2F2828' />
            <Text style={styles.optionTitle}>Thông báo</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </View>

        <View style={styles.optionContainer}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <FontAwesome6 name='users' size={24} color='black' />
            <Text style={styles.optionTitle}>Giới thiệu bạn bè</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </View>

        <Pressable style={styles.optionContainer} onPress={() => removeAuth()}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <MaterialIcons name='logout' size={24} color='black' />
            <Text style={styles.optionTitle}>Đăng xuất</Text>
          </View>
          <Ionicons name='chevron-forward' size={18} color='#2F2828' />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default User

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#BDBDBD',
  },
  optionTitle: { fontWeight: '500', color: '#2F2828' },
})
