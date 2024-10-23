import {ConfigpasswordData, ConfigpasswordType} from '../../types/apps/configpasswordTypes'
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

// fetch passwords
export const fetchAllPwd = async () => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigPasswordEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

//add password config
export const addPasswordConfig = async (data: ConfigpasswordData) => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigPasswordEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const createdItem = await response.json()
  toast.success('Password config add successfully')

  return createdItem
}

// delete account
export const deletePasswordConfig = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_KMS_ConfigPasswordEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Password config delete successfully')

  return id
}

//update password config

export const updatePasswordConfig = async (data: ConfigpasswordType) => {
  const response = await myFetch(`${apiUrls.apiUrl_KMS_ConfigPasswordEndpoint}/${data.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })
  const editPwdConfig = await response.json()
  toast.success('Password config edit successfully')

  return editPwdConfig
}
