export type TemplateType = {
  id?: number
  domain: string
  name: string
  description: string
  code: string
  path: string
  file: File,


}

export type TemplateTypes = {

  domain: string
  name: string
  description: string

  file?: File,


}
export type templateDetailsDataType = {
  id: number | null,
  templateDetailsData: TemplateType,
  file: File | null
}
export type TemplateData = {
  id: number,
  domain: string
  name: string,
  description: string,
  code: string,

  path: string,

  file: File,


}
