import apiUrls from "template-shared/configs/apiUrl";
import {myFetch} from "template-shared/@core/utils/fetchWrapper";


export const fetchAllAccountStat = async statType => {
    try {
        const url = `${apiUrls.apiUrl_IMS_AccountStatistics}/global?stat-type=${statType}`
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
export const fetchAccountStatByCode = async code => {
    try {
        const url = `${apiUrls.apiUrl_IMS_AccountStatistics}/object?code=${code}`
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
