import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import apiUrls from 'template-shared/configs/apiUrl'
import {AdminDomainTypeRequest, DomainDetailType} from 'template-shared/types/apps/domainTypes'

export const fetchAllDomains = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_DomainEndpoint)

  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}
export const fetchOneDomain = async (id: number) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_DomainEndpoint}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const data = await response.json()

  return data
}

export const deleteDomainById = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_IMS_DomainEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  toast.success('Domain delete successfully')

  return id
}

export const updateDomainView = async (domain: DomainDetailType) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_DomainEndpoint}/${domain.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(domain)
  })
  const data = await response.json()

  return data
}
export const updateDomain = async (domain: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_DomainImageEndpoint, {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: domain
  })

  const editDomain = await response.json()
  toast.success('Domain edit successfully')

  return editDomain
}

export const addNewDomain = async (domain: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_DomainImageEndpoint, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: domain
  })
  const createdItem = await response.json()
  toast.success('Domain add successfully')

  return createdItem
}

export const updatePictureDomain = async (data: { id: number; file: Blob }) => {
  try {
    const formData = new FormData()
    formData.append('file', data.file as File)
    const response = await myFetch(`${apiUrls.apiUrl_IMS_DomainImageUploadEndpoint}${data.id}`, {
      method: 'POST',
      headers: {},
      body: formData
    })
    if (response?.ok) {
      return await response.json()
    } else {
      throw new Error('Request failed')
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const addDomainAdmin = async (data: AdminDomainTypeRequest, domain: string) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountAdminDomainEndpoint}?domain=${domain}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })
  const createdItem = await response.json()
  toast.success('Admin Domain add successfully')

  return createdItem
}
