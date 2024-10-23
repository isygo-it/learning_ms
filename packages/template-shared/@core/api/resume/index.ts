import {ResumeShareInfo, ResumeTypes} from '../../../types/apps/ResumeTypes'

import apiUrls from 'template-shared/configs/apiUrl'
import {myFetch} from 'template-shared/@core/utils/fetchWrapper'
import {ShareResumeRequestDto} from 'template-shared/types/apps/accountTypes'
import {JobApplicationType} from '../../../types/apps/jobApplicationType'

export const fetchAll = async () => {
    const response = await myFetch(apiUrls.apiUrl_RPM_ResumeEndpoint)
    if (response.status === 204) {
        return []
    }
    const data = await response.json()

    return data
}

export const createResume = async (resume: FormData) => {
    const headers = new Headers({
        Accept: 'application/json'
    })
    const options = {
        method: 'POST',
        headers,
        body: resume
    }
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeFileUploadEndpoint}`, options)
    if (response.ok) {
        const data = await response.json()

        return data
    }
}
export const createAccountResume = async (resume: ResumeTypes) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/create/account`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(resume)
    })

     return  response
}
export const deleteResume = async (id: number) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        return id
    }
}
export const editresume = async (data: ResumeTypes) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/${data.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const editresume = await response.json()

        return editresume
    }
}
export const editReview = async (data: ResumeShareInfo) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_Resume_Review_UpdateEndpoint}/${data.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const res = await response.json()

        return res
    }
}

export const shareResume = async (data: { id: number; request: ShareResumeRequestDto }) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeShareInfoEndpoint}/${data.id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data.request)
    })
    if (response.ok) {
        const editresume = await response.json()

        return editresume
    }
}

export const updatePicture = async (data: { id: number; file: Blob }) => {
    const formData = new FormData()
    formData.append('file', data.file as File)
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeImageUploadEndpoint}/${data.id}`, {
        method: 'POST',
        headers: {},
        body: formData
    })
    if (response?.ok) {
        const editAccount = await response.json()

        return editAccount
    }
}

export const updateResumeFile = async (data: { id: number; file: Blob }) => {
    const formData = new FormData()
    formData.append('file', data.file as File)
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeFileUploadEndpoint}/${data.id}`, {
        method: 'PUT',
        headers: {},
        body: formData
    })
    if (response?.ok) {
        const editAccount = await response.json()

        return editAccount
    } else {
        throw new Error('Request failed')
    }
}

export const updateAdditionalFile = async (data: { id: number; files: Blob[] }) => {
    const formData = new FormData()
    for (const key of Object.keys(data.files)) {
        formData.append('files', data.files[key])
    }
    const response = await myFetch(`${apiUrls.apiUrl_RPM_Resume_Upload_MultiFileEndpoint}/${data.id}`, {
        method: 'PUT',
        headers: {},
        body: formData
    })
    if (response?.ok) {
        const uploadFiles = await response.json()

        return uploadFiles
    }
}

export const downloadAdditionalFile = async (originalFileName: string) => {
    const response = await myFetch(
        `${apiUrls.apiUrl_RPM_ResumeFileDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(
            originalFileName
        )}&version=1`
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
    }
}

export const deleteAdditionalFile = async (data: { id: number; originalFileName: string }) => {
    const response = await myFetch(
        `${apiUrls.apiUrl_RPM_Resume_Delete_MultiFileEndpoint}/${data.id}/${data.originalFileName}`,
        {
            method: 'DELETE'
        }
    )
    if (response.ok) {
        return data
    }
}

export const getUrlResume = async (originalFileName: string, domain: string) => {
    const response = await myFetch(
        `${apiUrls.apiUrl_RPM_ResumeFileDownloadEndpoint}?domain=${domain}&filename=${encodeURIComponent(
            originalFileName
        )}&version=1`
    )

    const data = await response

    return data.url
}
export const downloadResume = async (originalFileName: string) => {
    const response = await myFetch(
        `${apiUrls.apiUrl_RPM_ResumeFileDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(
            originalFileName
        )}&version=1`
    )

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
    }
}

export const fetchResumeById = async (id: number) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/${id}`)
    const resumeData: ResumeTypes = await response.json()

    return resumeData
}

export const fetchResumeData = async (id: string) => {
    const res = await fetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/${id}`)
    const resumeData: ResumeTypes = await res.json()

    return resumeData
}

export const fetchResumeByCandidate = async () => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/findByCandidateCode`)
    if (response.status === 204) {
        return {}
    }
    const data = await response.json()
    console.log(data)

    return data
}

export const newCandidateResume = async (data: ResumeTypes) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_ResumeEndpoint}/createResumeCandidate?domain=novobit.eu`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    const editresume = await response.json()

    return editresume
}
export const JobApplication = async (data: JobApplicationType) => {
    const response = await myFetch(`${apiUrls.apiUrl_RPM_JobApplicationEndpoint}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    const res = await response.json()

    return res
}
