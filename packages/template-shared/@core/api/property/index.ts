import apiUrls from '../../../configs/apiUrl'
import {myFetch} from '../../utils/fetchWrapper'
import {PropertyTypes} from '../../../types/apps/propertyTypes'

const API_URL = apiUrls.apiUrl_RPM_Update_ResumeEndpoint

export const fetchProperty = async (accountCode: string, guiName: string, name: string) => {
    try {
        const response = await myFetch(`${API_URL}/account?accountCode=${accountCode}&guiName=${guiName}&name=${name}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        if (response?.ok) {
            const data = await response.json()

            return data
        } else {
            throw new Error('Failed to fetch Property')
        }
    } catch (error) {
        throw new Error('Failed to fetch Property')
    }
}
export const fetchAllProperty = async (accountCode: string, guiName: string) => {
    try {
        const response = await fetch(`${API_URL}/account/gui?accountCode=${accountCode}&guiName=${guiName}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        if (response?.ok) {
            const data = await response.json()

            console.log('Fetched All property:', data)

            return data
        } else {
            throw new Error('Failed to fetch Property')
        }
    } catch (error) {
        throw new Error('Failed to fetch Property')
    }
}

export async function updateProperty(data: PropertyTypes, accountCode: string) {
    try {
        const response = await myFetch(`${API_URL}/account?code=${accountCode}`, {
            method: 'PUT',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response?.ok) {
            const data = await response.json()

            return data
        } else {
            throw new Error('Failed to update property: ${response.statusText}`')
        }
    } catch (error) {
        throw new Error('Failed to update property')
    }
}
