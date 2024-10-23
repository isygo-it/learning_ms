export type AppParameter = {
  id: number
  name: string
  value: string
  domain: string
  description: string

  //Audit info
  createDate?: Date
  createdBy?: string
  updateDate?: Date
  updatedBy?: string
}
export type appParameterType = {
  id?: number
  name?: string
  value?: string
  domain?: string
  description?: string
}

export type AppParameterRequest = {
  name: string
  value: string
  domain: string
  description: string
}
