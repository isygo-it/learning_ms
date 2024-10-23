import apiUrls from '../../../configs/apiUrl'
import {myFetch} from '../../utils/fetchWrapper'
import toast from 'react-hot-toast'
import {CustomerDetailType} from '../../../types/apps/customerTypes'
import {RequestStatus} from '../../../types/apps/userTypes'

export const fetchAllCustomer = async () => {
    try {
        const response = await myFetch(apiUrls.apiUrl_IMS_CustomerEndpoint, {
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
    } catch (error) {
        throw new Error('Failed to fetch data')
    }
}

export const fetchAllCustomerPagination = async (page: number, size: number) => {
    try {
        const response = await myFetch(`${apiUrls.apiUrl_IMS_CustomerEndpoint}/${page}/${size}`, {
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
    } catch (error) {
        throw new Error('Failed to fetch data')
    }
}

export const addCustomer = async (customer: FormData) => {
    try {
        const response = await myFetch(apiUrls.apiUrl_IMS_CustomerImageEndpoint, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: customer
        })
        if (!response.ok) {
            throw new Error(`Failed to add Customer. Status: ${response.status}`)
        }
        const createdItem = await response.json()
        toast.success('Customer add successfully')

        return createdItem
    } catch (error) {
        throw new Error('Request Failed')
    }
}

export const updateCustomer = async (customer: CustomerDetailType) => {
    console.log('hello', customer)

    const response = await myFetch(`${apiUrls.apiUrl_IMS_CustomerEndpoint}/${customer.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    const createdItem = await response.json()

    return createdItem
}

export const deleteCustomer = async (id: number) => {
    try {
        const response = await myFetch(`${apiUrls.apiUrl_IMS_CustomerEndpoint}/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        if (!response.ok) {
            throw new Error(`Failed to delete account. Status: ${response.status}`)
        }
        toast.success('Customer delete successfully')

        return id
    } catch (error) {
        throw new Error('Request Failed')
    }
}

export const updateStatusCustomer = async (data: RequestStatus) => {
    try {
        const response = await myFetch(
            apiUrls.apiUrl_IMS_CustomerUpdateStatusEndpoint + `?id=${data.id}&newStatus=${data.newReqStatus}`,
            {
                method: 'PUT',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to update admin status. Status: ${response.status}`)
        }
        toast.success('Customer status updated successfully')

        return data
    } catch (error) {
        throw new Error('Request Failed')
    }
}

export const updateStatusApplication = async (data: RequestStatus) => {
    try {
        const response = await myFetch(
            apiUrls.apiUrl_IMS_ApplicationUpdateStatusEndpoint + `?id=${data.id}&newStatus=${data.newReqStatus}`,
            {
                method: 'PUT',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to update admin status. Status: ${response.status}`)
        }
        toast.success('Application status updated successfully')

        return data
    } catch (error) {
        throw new Error('Request Failed')
    }
}

export const getDetailCustomer = async (id: number) => {
    try {
        const response = await myFetch(`${apiUrls.apiUrl_IMS_CustomerEndpoint}/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
        if (response.ok) {
            const data = await response.json()

            return data
        } else {
            throw new Error('Request Failed')
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updatePictureCustomer = async (data: { id: number; file: Blob }) => {
    try {
        const formData = new FormData()
        formData.append('file', data.file as File)
        const response = await myFetch(`${apiUrls.apiUrl_IMS_CustomerImageUploadEndpoint}/${data.id}`, {
            method: 'POST',
            headers: {},
            body: formData
        })
        if (response?.ok) {
            return await response.json()
        } else {
            throw new Error('Request failed')
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
