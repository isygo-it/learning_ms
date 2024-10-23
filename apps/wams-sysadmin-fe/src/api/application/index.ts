import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

export const fetchAllApplications = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_ApplicationEndpoint, {
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
export const deleteApplicationById = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_IMS_ApplicationEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  toast.success('Application delete successfully')

  return id
}

export const updateApplicationById = async (application: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_ApplicationImageEndpoint, {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: application
  })

  const editApplication = await response.json()
  toast.success('Application edit successfully')

  return editApplication
}

export const addNewApplication = async (application: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_ApplicationImageEndpoint, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },

    body: application
  })
  const createdItem = await response.json()
  toast.success('Application add successfully')

  return createdItem
}
