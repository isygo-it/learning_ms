import apiUrls from '../../../configs/apiUrl'
import {myFetch} from '../../utils/fetchWrapper'
import {SendMessageWebSocketType} from '../../../types/apps/chatTypes'

export const getChatsAccounts = async (userId: number) => {
    const response = await myFetch(apiUrls.apiUrl_MMS_ChatAccountEndpoint + `?userId=${userId}` + `&page=${1}` + `&size=${10}`, {
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

export const getChatsFromUser = async (userId: number, fromId: number) => {
    const response = await myFetch(
        apiUrls.apiUrl_MMS_ChatFromEndpoint + `?userId=${userId}` + `&SenderId=${fromId}` + `&page=${1}` + `&size=${10}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    )
    if (response.status == 204) {
        return []
    }
    const data = await response.json()

    return data
}

export const sendChatsAccounts = async (message: SendMessageWebSocketType, toUserId: number) => {
    await myFetch(apiUrls.apiUrl_MMS_ChatSendWithWebSocketEndpoint + `?userId=${toUserId}`, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })

    return message
}
