import React from 'react'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {getQuizDetail} from 'template-shared/@core/api/quiz'
import QuizView from '../../../../../views/apps/quiz/view/QuizView'

const CustomerDetailView = () => {
    const router = useRouter()
    const {id} = router.query

    const {data: quizData, isError, isLoading} = useQuery(['quizData', id], () => getQuizDetail(Number(id)), {})
    console.log('quizData', quizData)
    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError || !quizData) {
        return <div>Error loading customer data</div>
    }

    return (
        <div>
            <QuizView quizData={quizData}/>
        </div>
    )
}

export default CustomerDetailView
