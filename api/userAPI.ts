import axios from '@/utils/axiosInstance'

const updateUser = async (name: string, email?: string, avatar?: any) => {
  const formData = new FormData()
  formData.append('name', name)
  if (email) formData.append('email', email)
  if (avatar) formData.append('avatar', avatar)

  const response = await axios.put('/user/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export { updateUser }
