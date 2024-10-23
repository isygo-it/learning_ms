import apiUrls from '../../../configs/apiUrl'
import { myFetch } from '../../utils/fetchWrapper'
import toast from 'react-hot-toast'
import { RequestIsAdmin, RequestStatus } from '../../../types/apps/userTypes'
import localStorageKeys from '../../../configs/localeStorage'

// ** Fetch Role
export const fetchDataRoleAccount = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_RoleInfoEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

export const fetchOneAccount = async (id: number) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountEndpoint}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  if (response.ok) {
    const oneAccount = await response.json()
    console.log('acount details', oneAccount)

    return oneAccount
  }
}

export const updateAccountLanguage = async (id: number, language: string) => {
  const uppercaseLanguage = language.toUpperCase()
  const response = await myFetch(
    apiUrls.apiUrl_IMS_UpdateAccountLanguageEndpoint + `?id=${id}&language=${uppercaseLanguage}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
  if (response?.ok) {
    const editAccount = await response.json()

    return editAccount
  } else {
    return []
  }
}
export const fetchProfileFullData = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_MyAccountFullDataEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem(localStorageKeys.accessToken) + ''
    }
  })
  if (!response.ok) {
    throw new Error('Request failed')
  }
  const result = await response.json()

  return result
}
export const fetchAll = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AccountEndpoint, {
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
export const updateStatusAccount = async (data: RequestStatus) => {
  await myFetch(apiUrls.apiUrl_IMS_AccountUpdateStatusEndpoint + `?id=${data.id}&newStatus=${data.newReqStatus}`, {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Admin status updated successfully')

  return data
}
export const updateIsAdminAccount = async (data: RequestIsAdmin) => {
  await myFetch(apiUrls.apiUrl_IMS_AccountUpdateIsAdminEndpoint + `?id=${data.id}&newStatus=${data.newStatus}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Admin status updated successfully')

  return data
}

export const fetchAccounts = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AccountInfoEndpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  return await response.json()
}

// ** Fetch Role
export const getAccountsByDomain = async (domain: string) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AccountsByDomainEndpoint + `?domain=${domain}`, {
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

export const getAccountsByDomainStatus = async () => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AccountsStatusByDomainEndpoint, {
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

export const setLanguage = async (data: any) => {
  const response = await myFetch(`${apiUrls.apiUrl_SCUI_SetLanguageEndPoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })

  const result = await response.json()

  return result
}
