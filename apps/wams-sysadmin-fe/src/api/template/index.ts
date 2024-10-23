import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import {templateDetailsDataType, TemplateType, TemplateTypes} from '../../types/apps/templateTypes'
import toast from 'react-hot-toast'

// ** Fetch Config
export const fetchData = async () => {
  const response = await myFetch(apiUrls.apiUrl_MMS_MailTemplateEndpoint)
  if (response.status == 204) {
    return []
  }
  const data = await response.json()

  return data
}

// ** Add Template
export const createTemplate = async (data: TemplateTypes) => {
  if (data.file) {
    const formData = new FormData() // Create a FormData instance
    formData.append('domain', data.domain) // Append data to the form
    formData.append('name', data.name) // Append data to the form
    formData.append('description', data.description) // Append data to the form
    formData.append('file', data.file)
    const response = await myFetch(`${apiUrls.apiUrl_MMS_MailTemplateFileUploadEndpoint}`, {
      method: 'POST',
      body: formData
    })
    const createdItem = await response.json()

    return createdItem
  }
}

// **Update Template
export const updateTemplate = async (data: TemplateType) => {
  const formData = new FormData() // Create a FormData instance
  formData.append('domain', data.domain) // Append data to the form
  formData.append('name', data.name) // Append data to the form
  formData.append('code', data.code)
  formData.append('description', data.description) // Append data to the form
  if (data.file != null || data.file != undefined) {
    formData.append('file', data.file)
  }
  const response = await myFetch(`${apiUrls.apiUrl_MMS_MailTemplateUpdateByDomainEndpoint}/${data.domain}/${data.id}`, {
    method: 'PUT',
    headers: {},
    body: formData
  })
  const templateAdded = await response.json()

  return templateAdded
}

export const getData = async (templateDetailsData: templateDetailsDataType) => {
  const res = await myFetch(
    `${apiUrls.apiUrl_MMS_MailTemplateFileDownloadEndpoint}?domain=${templateDetailsData.templateDetailsData.domain}&filename=${templateDetailsData.templateDetailsData.code}&version=1`
  )

  return await res.arrayBuffer().then(data => {
    return new TextDecoder().decode(data)
  })
}

export const handleDownload = async (data: TemplateType) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_MMS_MailTemplateFileDownloadEndpoint}?domain=${data.domain}&filename=${data.code}&version=1`,
    {
      method: 'GET'
    }
  )

  if (response.ok) {
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = data.code + '.ftl' // Set the desired download filename
    a.click()
  }
}

// ** Delete Template
export const deleteTemplate = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_MMS_MailTemplateDelByDomainEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Template delete successfully')

  return id
}

// ** Delete Template
export const getDetailTemplate = async (id: number) => {
  const response = await fetch(`${apiUrls.apiUrl_MMS_MailTemplateEndpoint}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = response.json()

  return data
}
