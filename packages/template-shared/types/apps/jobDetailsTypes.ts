export type JobDetailsType = {
  id: number
  description: string
  experienceMin: number
  experienceMax: number
  responsibility: string[]
  hardSkills: JobSkills[]
  softSkills: JobSkills[]
  jobInfo: JobInfo
  contractInfo: ContractInfo
}

export interface AdditionalFiles {
  id: number
  originalFileName: string
  size: number
}

interface JobSkills {
  id: number
  type: string
  name: string
  level: 'beginner' | 'intermediate' | 'confirmed' | 'expert'
  isMandatory?: boolean
}

interface JobInfo {
  id: number
  startDate: Date
  endDate: Date
  deadline: Date
  position: string
  educationLevel: string
  qualifications: string[]
}

interface ContractInfo {
  id: number
  location: string
  salaryMin: number
  salaryMax: number
  workingMode: string
  contract: string
  availability: string
  currency?: string
}
