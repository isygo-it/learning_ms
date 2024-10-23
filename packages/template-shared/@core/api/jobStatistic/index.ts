import { myFetch } from '../../utils/fetchWrapper'
import apiUrls from '../../../configs/apiUrl'

export const fetchAllJobStat = async statType => {
  try {
    const url = `${apiUrls.apiUrl_RPM_JOB_STATS}/global?stat-type=${statType}`
    const response = await myFetch(url)

    if (response.status === 204) {
      return []
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching global statistics:', error)
    throw error
  }
}
export const fetchJobStatByCode = async code => {
  try {
    const url = `${apiUrls.apiUrl_RPM_JOB_STATS}/object?code=${code}`
    const response = await myFetch(url)

    if (response.status === 204) {
      return []
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching object statistics:', error)
    throw error
  }
}
