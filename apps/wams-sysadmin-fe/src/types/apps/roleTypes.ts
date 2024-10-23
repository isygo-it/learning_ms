import {ApplicationType} from 'template-shared/types/apps/applicationTypes'

export type RoleTypes = {
  id?: number
  code?: string
  name?: string
  description?: string
  numberOfUsers?: number
  allowedTools: ApplicationType[]
  rolePermission: RolePermission[]

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}

export type RoleData = {
  name: string
  description: string
  allowedTools: ApplicationType[]
}

export type RolePermission = {
  id?: number
  serviceName: string
  objectName: string
  read: boolean
  write: boolean
  delete: boolean
}

export type ListCheckBox = {
  serviceName: string
  objectName: string
  option: string
}
