import React from 'react'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {getTopicDetail} from "../../../../../views/apps/topic/view";

const TopicDetailView = () => {
  const router = useRouter()
  const {id} = router.query

  const {data: topicData, isError, isLoading} = useQuery(['topicData', id], () => getTopicDetail(Number(id)), {})
  console.log('topicData', topicData)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !topicData) {
    return <div>Error loading customer data</div>
  }


}

export default TopicDetailView
