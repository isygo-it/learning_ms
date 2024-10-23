export interface ResumeProfExperience {
    id?: number
    jobTitle: string
    employer: string
    city: string
    country: string
    startDate: Date
    endDate: Date
    workhere: boolean
    description: string
    technology?: string[]


    disabledWorkhere?: boolean
}

export interface ResumeEducation {
    id: number
    institution: string
    city: string
    country: string
    qualification: string
    fieldOfStudy: string
    yearOfGraduation: Date
}

export interface Skill {
    id: number
    name: string
    level: 'beginner' | 'intermediate' | 'confirmed' | 'expert'
    score: number
}

export interface ResumeCertification {
    id: number
    name: string
    dateOfObtained: Date
    link: string
}

export interface ResumeLanguage {
    id: number
    name: string
    level: 'beginner' | 'intermediate' | 'good' | 'alright' | 'fluent'
}

export interface AdditionalFiles {
    id: number
    originalFileName: string
    size: number
}

export interface ResumeDetails {
    id: number
    profExperiences: ResumeProfExperience[]
    educations: ResumeEducation[]
    skills: Skill[]
    certifications: ResumeCertification[]
    languages: ResumeLanguage[]
}
