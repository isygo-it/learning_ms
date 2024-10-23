export type TopicTypes = {

    id?: number
    code: string
    domain: string
    name: string
    description: string
    imagePath: string


}

export type TopicDetailType = {
    id: number
    code: string
    domain: string
    name: string
    description: string
    imagePath: string

  createDate?:   string,
  createdBy?: string,
  updateDate?: string,
  updatedBy?: string
}
