import apiUrls from 'template-shared/configs/apiUrl'
import {AccountDetails, AccountsTypes} from 'template-shared/types/apps/accountTypes'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

// fetch account
export const fetchAllAccounts = async () => {
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

export const resendEmailCreation = async id => {
  await myFetch(`${apiUrls.apiUrl_IMS_ResendEmailCreationEndpoint}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  return id
}
export const deleteAccount = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_IMS_AccountEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  toast.success('Account delete successfully')

  return id
}

export const addAccount = async (data: AccountsTypes) => {
  const response = await myFetch(apiUrls.apiUrl_IMS_AccountEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const createdItem = await response.json()
  toast.success('Account add successfully')

  return createdItem
}

//update account

export const updateAccount = async (data: AccountsTypes) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountEndpoint}/${data.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  })
  const editAccount = await response.json()

  return editAccount
}

export const updatePicture = async (data: { id: number; file: Blob }) => {
  const formData = new FormData()
  formData.append('file', data.file as File)
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountImageUploadEndpoint}/${data.id}`, {
    method: 'POST',
    headers: {},
    body: formData
  })
  const editAccount = await response.json()

  return editAccount
}

//fetch one account
export const fetchOneAccount = async (id: number) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountEndpoint}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const oneAccount = await response.json()

  return oneAccount
}

// update Account details
export const updateAccountDetails = async (data: AccountDetails) => {
  const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountDetailsEndpoint}/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const editAccountDetails = await response.json()

  return editAccountDetails
}
