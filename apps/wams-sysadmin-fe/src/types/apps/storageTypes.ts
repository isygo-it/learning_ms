export type StorageConfigType = {
  id: number
  domain: string
  type: string
  userName: string
  password: string
  url: string
}
export type StorageConfigTypes = {
  id?: number
  domain?: string
  type?: string
  userName?: string
  password?: string
  url?: string
}

export interface StorageConfigTypeEdit {
  id: number,
  domain: string,
  url: string,
  userName: string,
  type: string,
  password: string
}

export interface StorageConfigTypeRequest {
  domain: string,
  url: string,
  userName: string,
  type: string,
  password: string
}
