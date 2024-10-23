import React from 'react'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {getAuthorDetail} from "../../../../../views/apps/author/view";

const AuthorDetailView = () => {
  const router = useRouter()
  const {id} = router.query

  const {data: authorData, isError, isLoading} = useQuery(['authorData', id], () => getAuthorDetail(Number(id)), {})
  console.log('authorData', authorData)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !authorData) {
    return <div>Error loading customer data</div>
  }


}

export default AuthorDetailView
