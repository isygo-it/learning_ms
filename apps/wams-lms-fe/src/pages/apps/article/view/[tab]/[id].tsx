import React from 'react'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {getArticleDetail} from "../../../../../views/apps/article/view";
import ArticleView from "../../../../../views/apps/article/view/ArticleView";

const ArticleDetailView = () => {
  const router = useRouter()
  const {id} = router.query

  const {data: articleData, isError, isLoading} = useQuery(['articleData', id], () => getArticleDetail(Number(id)), {})
  console.log('ArticleData', articleData)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !articleData) {
    return <div>Error loading customer data</div>
  }

  return <ArticleView articleData={articleData}/>
}

export default ArticleDetailView
