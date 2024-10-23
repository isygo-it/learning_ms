import {RoleTypes} from '../../types/apps/roleTypes'
import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'

const API_URL = apiUrls.apiUrl_IMS_RoleInfoEndpoint

export const addRole = async (data: RoleTypes) => {
  const response = await myFetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  const createdItem = await response.json()
  toast.success('Role account add successfully')

  return createdItem
}

export const updateRole = async (data: RoleTypes) => {
  const response = await myFetch(`${API_URL}/${data.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })

  return await response.json()
}

// ** Delete Role
export const deleteRole = async (id: number) => {
  await myFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  toast.success('Role account delete successfully')

  return id
}

export const getDetailRole = async (id: number) => {
  const response = await myFetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const oneCustomer = await response.json()

  return oneCustomer
}
