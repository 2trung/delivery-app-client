// {
//     "code": 1000,
//     "message": "Success",
//     "data": {
//         "nextAction": "register",
//         "existingUser": false
//     }
// }

export interface BaseApiResponse<T> {
  code: number
  message?: string
  data: T
}
