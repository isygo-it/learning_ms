import { myFetch } from 'template-shared/@core/utils/fetchWrapper'
import toast from 'react-hot-toast'
import apiUrls from 'template-shared/configs/apiUrl'
import { QuizDetailType, QuizType } from 'template-shared/types/apps/quizTypes'
import { AnswerType, QuizAnswerType } from '../../../types/apps/quizCandidateType'
import { boolean } from 'yup'

export const fetchAllQuizs = async () => {
  const response = await myFetch(apiUrls.apiUrl_QUIZ_QuizEndpoint)
  const data = await response.json()

  return data
}
export const getQuizDetail = async (id: number) => {
  const response = await myFetch(`${apiUrls.apiUrl_QUIZ_QuizEndpoint}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const data = await response.json()

  return data
}

export const deleteQuizById = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_QUIZ_QuizEndpoint}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Quiz delete successfully')

  return id
}

export const updateQuiz = async (quiz: QuizDetailType) => {
  console.log("quizzzzzzzzzzzz",quiz)
  const response = await myFetch(`${apiUrls.apiUrl_QUIZ_QuizEndpoint}/${quiz.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quiz)
  })
  const editQuiz = await response.json()
  toast.success('Quiz edit successfully')

  return editQuiz
}

export const addNewQuiz = async (quiz: QuizType) => {
  const response = await myFetch(apiUrls.apiUrl_QUIZ_QuizEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(quiz)
  })

  const createdItem = await response.json()
  toast.success('Quiz added successfully')

  return createdItem
}

/**** quiz candidate api *****/
export const startCandidateQuiz = async (quizCode, accountCode) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_StartQuizCandidateEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(boolean)
    }
  )

  const data = await response.json()

  return data
}

export const updateCandidateQuiz = async (quizCode, accountCode) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_SubmitQuizCandidateEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(boolean)
    }
  )

  const data = await response.json()

  return data
}

export const addCandidateQuizAnswer = async (quizCode, accountCode, candidateQuizAnswer: QuizAnswerType) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_QuizCandidateAnswerEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(candidateQuizAnswer)
    }
  )

  const data = await response.json()

  return data
}

export const getQuizReport = async (quizCode, accountCode) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_QuizCandidateReportEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
  const data = await response.json()

  return data
}

export const getCandidateQuiz = async (quizCode, accountCode) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_QuizCandidateCopyEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
  const data = await response.json()

  return data
}

export const startCandidateQuizAnswer = async (quizCode, accountCode, questionId) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_StartQuizCandidateAnswerEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(questionId)
    }
  )

  const data = await response.json()

  return data
}

export const getAllCandidateQuiz = async () => {
  const response = await myFetch(apiUrls.apiUrl_QUIZ_QuizCandidateEndPoint)
  const data = await response.json()

  return data
}

export const deleteQuizCandidateById = async (id: number) => {
  await myFetch(`${apiUrls.apiUrl_QUIZ_QuizCandidateEndPoint}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })

  toast.success('Candidate quiz delete successfully')

  return id
}

export const getCompleteCandidateQuiz = async (quizCode, accountCode) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_CompleteQuizCandidateEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
  const data = await response.json()

  return data
}

export const getQuizByCandidateAndTags = async (accountCode, tags) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_QuizByCandidateAndTagsEndPoint}?accountCode=${accountCode}&tags=${tags}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
  const data = await response.json()

  return data
}

export const uploadImageQuestion = async (data: any) => {
  const response = await myFetch(`${apiUrls.apiUrl_QUIZ_QuestionImageUploadEndPoint}/${data.id}`, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },

    body: data.file
  })

  return response
}

export const getQuizByCategory = async category => {
  const response = await myFetch(`${apiUrls.apiUrl_QUIZ_QuizByCategoryEndPoint}?category=${category}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const data = await response.json()

  return data
}
export const getQuizDetailByCode = async (code: string) => {
  const response = await myFetch(`${apiUrls.apiUrl_QUIZ_QuizDetailsByCodeEndpoint}/${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
  const data = await response.json()

  return data
}

export const addCandidateQuizAnswerList = async (quizCode, accountCode, answerList: AnswerType[]) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_QuizCandidateAnswerListEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(answerList)
    }
  )

  const data = await response.json()

  return data
}

export const getCompleteAnswerClean = async (quizCode, accountCode) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_QUIZ_CompleteQuizAnswerCleanEndPoint}?quizCode=${quizCode}&accountCode=${accountCode}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  )
  const data = await response.json()

  return data
}
