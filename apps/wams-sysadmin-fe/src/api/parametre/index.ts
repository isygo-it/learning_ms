import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import {AppParameterRequest, appParameterType} from '../../types/apps/appParameterTypes'
import toast from 'react-hot-toast'

export const fetchAllParametre = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AppParameterEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

export const deleteParametreById = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_IMS_AppParameterEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('App Paramatre delete successfully')

  return id
}

export const updateParametreById = async (param: appParameterType) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AppParameterEndpoint}/${param.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(param)
  })

  const editAppParamtreConfig = await response.json()
  toast.success('App Paramatre edit successfully')

  return editAppParamtreConfig
}

export const addNewParametre = async (param: AppParameterRequest) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AppParameterEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(param)
  })

  const createdItem = await response.json()
  toast.success('App Paramatre add successfully')

  return createdItem
}
