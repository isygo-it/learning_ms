// ** Redux Imports
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import {ConfigData} from '../../types/apps/ConfigTypes'
import toast from 'react-hot-toast'

// ** Fetch Config
export const fetchData = async () => {
  const response = await myFetch(apiUrls.apiUrl_MMS_MailSenderConfigEndpoint)
  console.log('data is empty', response.status == 204)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

// ** Add Config
export const addConfig = async (data: ConfigData) => {
  const response = await myFetch(apiUrls.apiUrl_MMS_MailSenderConfigEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })

  const createdItem = await response.json()
  toast.success('Config add successfully')

  return createdItem
}

// **Update Config
export const updateConfig = async (data: ConfigData) => {
  const response = await myFetch(`${apiUrls.apiUrl_MMS_MailSenderConfigEndpoint}/${data.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })

  return await response.json()
}

// ** Delete Config
export const deleteConfig = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_MMS_MailSenderConfigEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Configuration delete successfully')

  return id
}
