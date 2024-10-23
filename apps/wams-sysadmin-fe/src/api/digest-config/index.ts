// ** Redux Imports
import {DigestConfigData, DigestConfigType} from '../../types/apps/DigestConfig'
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

export const fetchData = async () => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigDigestEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

export const addDigest = async (data: DigestConfigData) => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigDigestEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const pebAdded = await response.json()

  return pebAdded
}

// **Update Role
export const updateDigest = async (data: DigestConfigType) => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigDigestEndpoint + `/${data.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const editDigestConfig = await response.json()
  toast.success('Digest config edit successfully')

  return editDigestConfig
}

// ** Delete User
export const deleteDigest = async (id: number) => {
  await myFetch(apiUrls.apiUrl_KMS_ConfigDigestEndpoint + `/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Digest config delete successfully')

  return id
}
