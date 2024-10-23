import { RoleTypes } from './roleTypes'
import { ThemeColor } from '../../@core/layouts/types'
import { AddressTypes } from './addressTypes'

export type AccountsTypes = {
  id?: number
  code?: string
  email?: string
  domain?: string
  origin?: string
  isAdmin: boolean
  adminStatus?: string
  systemStatus?: string | undefined
  accountDetails?: AccountDetails
  phoneNumber: string
  roleInfo?: RoleTypes[] | undefined
  language?: string
  imagePath?: string
  fullName?: string
  functionRole?: any
  authType?: string
  connectionTrackings?: ConnectionTracking[]

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type MiniAccount = {
  id?: number
  code: string
  email: string
  fullName: string
  imagePath?: string
  avatarColor?: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}
export type MiniAccountChatType = {
  id?: number
  code: string
  email: string
  fullName: string
  imagePath?: string
  avatarColor?: string
  status: string
  colorStatus?: string
}

export type ShareResumeRequestDto = {
  resumeOwner: string
  accountsCode: MiniAccount[]
}

export type ShareJobRequestDto = {
  jobOwner: string
  accountsCode: MiniAccount[]
}

export type ShareResumeRequest = {
  id: number
  request: ShareResumeRequestDto
}

export enum AdminStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

export type ContactsType = {
  type?: string
  value?: number
}

export type Address = {
  country?: string
}

export type AccountDetails = {
  id?: number
  firstName?: string
  lastName?: string
  country?: string
  contacts?: ContactsType[]
  address?: AddressTypes
}

export interface ConnectionTracking {
  id: number
  browser: string
  loginDate: string
  device: string
  logApp?: string
  ipAddress: string
}

export interface AdminStatusType {
  [key: string]: ThemeColor
}

export const systemStatusObj: AdminStatusType = {
  IDLE: 'error',
  REGISTRED: 'success',
  LOCKED: 'secondary',
  TEM_LOCKED: 'info',
  EXPIRED: 'warning'
}
