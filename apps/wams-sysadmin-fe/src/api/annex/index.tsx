import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import {AnnexType} from 'template-shared/types/apps/annexTypes'

const API_URL = apiUrls.apiUrl_IMS_AnnexEndpoint
export const fetchAllAnnexs = async () => {
  const response = await myFetch(API_URL, {
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

export const deleteAnnexById = async (id: number) => {
  await myFetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  return id
}
export const addNewAnnex = async (param: AnnexType) => {
  const response = await myFetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(param)
  })

  const createdItem = await response.json()
  toast.success('Annex add successfully')

  return createdItem
}

export const updateAnnexById = async (param: AnnexType) => {
  const response = await myFetch(`${API_URL}/${param.id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(param)
  })
  const editAnnex = await response.json()
  toast.success('Annex edit successfully')

  return editAnnex
}
