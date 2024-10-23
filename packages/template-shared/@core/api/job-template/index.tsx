import apiUrls from '../../../configs/apiUrl'
import {myFetch} from '../../utils/fetchWrapper'
import {JobTemplate} from '../../../types/apps/jobTemplateTypes'

const API_URL = apiUrls.apiUrl_RPM_JobOffer_TemplateEndpoint
export const fetchAlljobTemplates = async () => {
    const response = await myFetch(API_URL)
    console.log(response)
    if (response.status === 200) {
        const data = await response.json()

        return data
    }
    if (response.status === 204) {
        return []
    }
}

export const deletejobTemplateById = async (id: number) => {
    const response = await myFetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'jobTemplate/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    if (response.status === 200) {
        return id
    }
}

export const updatejobTemplateById = async (jobTemplate: FormData) => {
    const response = await myFetch(API_URL, {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: jobTemplate
    })
    if (response.status === 200) {
        const data = await response.json()

        return data
    }
}

export const addNewjobTemplate = async (jobTemplate: JobTemplate) => {
    const response = await myFetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify(jobTemplate)
    })
    if (response.status === 200) {
        const data = await response.json()

        return data
    }
}
