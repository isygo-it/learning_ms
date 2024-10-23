// ** Redux Imports
import toast from 'react-hot-toast'
import {ChangePasswordParams, ResetPaswordParams} from 'template-shared/context/types'
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import localStorageKeys from 'template-shared/configs/localeStorage'

export const sendForgetPWDRequest = async (data: ResetPaswordParams) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_PasswordForgottenEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const result = await response.json()

  return result
}

export const changePassword = async (data: { newPassword: string; oldPassword: string }) => {
  const storedToken = window.localStorage.getItem(localStorageKeys.accessToken)

  await myFetch(apiUrls.apiUrl_KMS_ChangePasswordEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + storedToken + ''
    },
    body: JSON.stringify(data)
  })
  toast.success('Password Changed Successfully')
}

export const resetPassword = async (data: ChangePasswordParams) => {
  await myFetch(apiUrls.apiUrl_IMS_RestPasswordViaTokenEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
}
