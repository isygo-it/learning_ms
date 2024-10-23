// ** Redux Imports
import {PebConfigData, PebConfigType} from '../../types/apps/pebConfig'
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

export const fetchData = async () => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigPebEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}
export const addPeb = async (data: PebConfigData) => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigPebEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const createdItem = await response.json()
  toast.success('Peb config add successfully')

  return createdItem
}

export const updatePeb = async (data: PebConfigType) => {
  const response = await myFetch(`${apiUrls.apiUrl_KMS_ConfigPebEndpoint}/${data.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const editPwdConfig = await response.json()
  toast.success('Peb  edit successfully')

  return editPwdConfig
}

// ** Delete User
export const deletePeb = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_KMS_ConfigPebEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  toast.success('Peb delete successfully')

  return id
}
