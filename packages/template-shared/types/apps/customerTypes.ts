import {AddressTypes} from './addressTypes'
import {AdminStatus} from './accountTypes'

export type CustomerType = {
    id?: number
    name: string
    description: string
    imagePath: string
    email: string
    url: string
    phoneNumber: string
    domain: string
    accountCode?: string
    adminStatus: AdminStatus

    //Audit info
    createDate?: Date
    createdBy?: string
    updateDate?: Date
    updatedBy?: string
}

export type CustomerDetailType = {
    id: number
    name: string
    description: string
    imagePath: string
    url: string
    email?: string
    phoneNumber?: string
    domain: string
    accountCode?: string
    createDate?: Date
    updateDate?: Date
    adminStatus: AdminStatus
    address?: AddressTypes
}
