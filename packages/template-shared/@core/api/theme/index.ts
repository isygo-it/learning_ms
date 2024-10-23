import apiUrls from '../../../configs/apiUrl'
import {Theme, ThemeRequest} from '../../context/settingsContext'
import {myFetch} from '../../utils/fetchWrapper'

const API_URL = apiUrls.apiUrl_IMS_ThemeEndpoint

export const updateThemeById = async (theme: Theme) => {
    try {
        const response = await myFetch(`${API_URL}/${theme.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(theme)
        })
        if (response?.ok) {
            const data = await response.json()

            return data
        } else {
            throw new Error('Failed to update application')
        }
    } catch (error) {
        throw new Error('Failed to update application')
    }
}
export const updateThemeByCode = async (theme: ThemeRequest) => {
    console.log(theme)
    try {
        console.log(JSON.stringify(theme))

        const response = await myFetch(`${API_URL}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(theme)
        })
        console.log(response)
        if (response.ok) {
            const data = await response.json()

            return data
        } else {
            throw new Error('Failed to find theme')
        }
    } catch (error) {
        throw new Error('Failed to find theme')
    }
}

export const findThemeByCode = async (theme: ThemeRequest) => {
    console.log(theme)
    try {
        const response = await myFetch(`${API_URL}/find/${theme.domainCode}/${theme.accountCode}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        if (response.status === 204) {
            console.log('No preference Theme found')

            return null
        } else if (response.ok) {
            const data = await response.json()

            return data
        } else {
            throw new Error('Failed to find theme')
        }
    } catch (error) {
        throw new Error('Failed to find theme')
    }
}
