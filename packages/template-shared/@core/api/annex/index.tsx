import { myFetch } from '../../utils/fetchWrapper'
import apiUrls from '../../../configs/apiUrl'

const API_URL = apiUrls.apiUrl_IMS_AnnexEndpoint + '/getByCode/'
const API_URL_REF = apiUrls.apiUrl_IMS_AnnexEndpoint + '/getByCodeAndRef/'

export const getAnnexByCode = async (code: string) => {
  const response = await myFetch(`${API_URL}${code}`, {
    method: 'GET',
    headers: {
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
export const getAnnexByCodeAndReference = async (code: string, reference: string) => {
  const response = await myFetch(`${API_URL_REF}${code}/${reference}`, {
    method: 'GET',
    headers: {
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
