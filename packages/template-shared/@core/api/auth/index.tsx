import {myFetch} from '../../utils/fetchWrapper'
import apiUrls from '../../../configs/apiUrl'
import {authRequestType} from '../../../types/apps/authRequestTypes'
import {ChangePasswordRequest} from '../../../context/types'

export const login = async (data: authRequestType) => {
    const response = await myFetch(`${apiUrls.apiUrl_IMS_AccountCheckAuthType}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const res = await response.json()

        return res
    }
}

export const resetPassword = async (data: ChangePasswordRequest) => {
    const response = await myFetch(apiUrls.apiUrl_IMS_RestPasswordViaTokenEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    if (response.ok) {
        return response
    }
}
