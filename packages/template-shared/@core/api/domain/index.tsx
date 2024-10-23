import apiUrls from '../../../configs/apiUrl'
import {myFetch} from '../../utils/fetchWrapper'
import toast from 'react-hot-toast'
import {RequestStatus} from '../../../types/apps/userTypes'

const API_URL = apiUrls.apiUrl_IMS_DomainNamesEndpoint

export const fetchDomains = async () => {
    const response = await myFetch(API_URL, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

    if (response.status == 200) {
        const domains = await response.json()

        console.log('Fetched domains:', domains)

        return domains
    } else {
        throw new Error('Failed to fetch domains')
    }
}

export const getDomainNames = async () => {
    const response = await myFetch(apiUrls.apiUrl_IMS_DomainEndpoint, {
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

    return await response.json()
}
export const updateDomainStatus = async (data: RequestStatus) => {
    await myFetch(`${apiUrls.apiUrl_IMS_DomainUpdateStatusEndpoint}?id=${data.id}&newStatus=${data.newReqStatus}`, {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
    toast.success('Domain status updated successfully')

    return data
}
