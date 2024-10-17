import { BaseApiResponse } from './baseApiResponse'
export interface UserDataResponse
  extends BaseApiResponse<{
    id: string
    name: string
    phoneNumber: string
    email: string
  }> {}
