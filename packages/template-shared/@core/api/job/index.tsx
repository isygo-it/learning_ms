import apiUrls from '../../../configs/apiUrl'
import { myFetch } from '../../utils/fetchWrapper'
import { ShareJobRequestDto } from 'template-shared/types/apps/accountTypes'
import { JobOfferType } from '../../../types/apps/jobOfferTypes'

export const fetchAll = async () => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOfferEndpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.status === 204) {
      return []
    }

    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(`Error: ${error}`)
  }
}

export const fetchJobDataById = async (id: number) => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOfferEndpoint}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.status === 204) {
      return []
    }

    return await response.json()
  } catch (error) {
    throw new Error(`Error: ${error}`)
  }
}

export const addjob = async (data: JobOfferType) => {
  try {
    const response = await myFetch(apiUrls.apiUrl_RPM_JobOfferEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response?.ok) {
      const createJob = await response.json()

      return createJob
    } else {
      throw new Error('Request failed')
    }
  } catch (e) {
    throw e
  }
}
export const fetchJobOffersNotAssignedToResume = async (resumeCode: string) => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobApplicationEndpoint}/not-applied/${resumeCode}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    if (response.status === 204) {
      return []
    }

    const data = await response.json()

    return data
  } catch (error) {
    throw new Error(`Error: ${error}`)
  }
}

export const editJob = async (data: JobOfferType) => {
  try {
    data.industry
    console.log(data)

    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOfferEndpoint}/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(data)
    })
    if (response?.ok) {
      const editJob = await response.json()

      return editJob
    } else {
      throw new Error('Request failed')
    }
  } catch (e) {
    throw e
  }
}
export const deletejob = async (id: number) => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOfferEndpoint}/${id}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      return id
    } else {
      throw new Error(`Error deleting job: ${response.statusText}`)
    }
  } catch (e) {
    throw new Error(`Error deleting job: ${e.message}`)
  }
}
export const updateAdditionalFile = async (data: { id: number; files: Blob[] }) => {
  try {
    const formData = new FormData()
    for (const key of Object.keys(data.files)) {
      formData.append('files', data.files[key])
    }
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOffer_Upload_MultiFileEndpoint}/${data.id}`, {
      method: 'PUT',
      headers: {},
      body: formData
    })
    if (response?.ok) {
      const uploadFiles = await response.json()

      return uploadFiles
    } else {
      throw new Error('Request failed')
    }
  } catch (error) {
    throw error
  }
}

export const downloadAdditionalFile = async (originalFileName: string) => {
  try {
    const response = await myFetch(
      `${apiUrls.apiUrl_RPM_JobOfferDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(originalFileName)}&version=1`
    )
    console.log(response)
    if (response.ok) {
      const blob = await response.blob()
      console.log(blob)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = originalFileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      throw new Error('Échec du téléchargement du fichier')
    }
  } catch (error) {
    console.error(error)
  }
}
export const deleteAdditionalFile = async (data: { id: number; originalFileName: string }) => {
  try {
    const response = await myFetch(
      `${apiUrls.apiUrl_RPM_JobOffer_Delete_MultiFileEndpoint}/${data.id}/${data.originalFileName}`,
      {
        method: 'DELETE'
      }
    )
    if (response.ok) {
      return data
    } else {
      throw new Error(`Error deleting job: ${response.statusText}`)
    }
  } catch (e) {
    throw new Error(`Error deleting job: ${e.message}`)
  }
}
export const shareJob = async (data: { id: number; request: ShareJobRequestDto }) => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOffer_ShareEndpoint}/${data.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.request)
    })
    if (response.ok) {
      const sharedJob = await response.json()

      return sharedJob
    }
  } catch (e) {
    throw e
  }
}
export const fetchJobData = async (id: number) => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobOfferEndpoint}/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const data = await response.json()

    return data
  } catch (e) {
    throw e
  }
}
