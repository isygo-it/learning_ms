import {myFetch} from 'template-shared/@core/utils/fetchWrapper'

import {TokenConfigTypes, TokenData} from '../../types/apps/tokenConfig'
import toast from 'react-hot-toast'
import apiUrls from 'template-shared/configs/apiUrl'

// ** Fetch Token Details
export const fetchData = async () => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigTokenEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

// ** Add TokenConfig
export const addToken = async (data: TokenData) => {
  const response = await myFetch(apiUrls.apiUrl_KMS_ConfigTokenEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })

  const createdItem = await response.json()
  toast.success('Token management add successfully')

  return createdItem
}

// **Update TokenConfig
export const updateToken = async (data: TokenConfigTypes) => {
  await myFetch(`${apiUrls.apiUrl_KMS_ConfigTokenEndpoint}/${data.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  toast.success('Token updated successfully')

  return data
}

// ** Delete TokenConfig
export const deleteToken = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_KMS_ConfigTokenEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  toast.success('Token delete successfully')

  return id
}
