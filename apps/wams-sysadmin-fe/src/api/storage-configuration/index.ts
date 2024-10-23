import {StorageConfigTypeRequest, StorageConfigTypes} from '../../types/apps/storageTypes'
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

export const fetchAllStorageConfig = async () => {
  const response = await myFetch(apiUrls.apiUrl_SMS_StorageConfigEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

export const deleteStorageConfigById = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_SMS_StorageConfigEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Storage configuration delete successfully')

  return id
}

export const updateStorageConfig = async (storageConfig: StorageConfigTypes) => {
  await myFetch(`${apiUrls.apiUrl_SMS_StorageConfigEndpoint}/${storageConfig.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(storageConfig)
  })
  toast.success('Storage configuration updated successfully')

  return storageConfig
}
export const addNewStorageConfig = async (storageConfig: StorageConfigTypeRequest) => {
  const response = await myFetch(apiUrls.apiUrl_SMS_StorageConfigEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(storageConfig)
  })
  const createdItem = await response.json()
  toast.success('Storage configuration add successfully')

  return createdItem
}
