import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import {AvailableEmailsRequest} from 'template-shared/types/apps/workflowTypes'

const API_URL = apiUrls.apiUrl_IMS_AccountEmailsEndpoint
const API_URL_RPM = apiUrls.apiUrl_RPM_WorkflowBoardEndpoint

export const fetchEmails = async (domain: string) => {
    const response = await myFetch(API_URL + '?domain=' + domain, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

    if (response.status == 200) {
        const emails = await response.json()

        return emails
    }
}

export const fetchWorkflowEmails = async (request: AvailableEmailsRequest) => {
    const wfCodeParam = request.wfCode ? `?wfCode=${request.wfCode}&` : ''
    const response = await myFetch(`${API_URL_RPM}/watchers${wfCodeParam}domain=${request.domain}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

    if (response.status == 200) {
        const emails = await response.json()

        return emails
    }
}
