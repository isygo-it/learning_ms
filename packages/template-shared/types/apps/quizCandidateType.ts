export type QuizCandidateType = {
  id?: number
  accountCode?: string
  quizCode?: string
  startDate?: Date
  submitDate?: Date
  score?: number
}

export type QuizAnswerType = {
  id?: number
  question?: number
  option?: number
  answerText?: string
}

export type CandidateQuizReportType = {
  id?: number
  code?: string
  description: string
  name: string
  score: number
  sections: sectionDetailsType[]
}

export type sectionDetailsType = {
  id?: number
  description: string
  name: string
  score: number
  order: number
  questions: questionDetailsType[]
}
export type questionDetailsType = {
  id?: number
  durationInSec: number
  locked: boolean
  score: number
  order: number
  question: string
  remainInSec: number
  textAnswer: string
  type: string
  options: optionDetailsType[]
  imagePath: string
}

export type optionDetailsType = {
  id?: number
  checked: boolean
  option: string
  textAnswer: string
}
export type AnswerType = {
  id?: number
  question: number
  option?: number
  answerText: string
  score: number
}
