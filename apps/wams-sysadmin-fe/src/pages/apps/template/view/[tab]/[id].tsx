import TemplateView from '../../../../../views/apps/template/view/TemplateView'
import {useQuery} from 'react-query'
import {getDetailTemplate} from '../../../../../api/template'
import {useRouter} from 'next/router'
import React from 'react'

const TemplateViewdetail = () => {
  const router = useRouter()
  const {id} = router.query
  const {
    data: templateDetailsData,
    isError,
    isLoading
  } = useQuery(['templateDetailsData', id], () => getDetailTemplate(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !templateDetailsData) {
    return <div>Error loading template data</div>
  }

  return <TemplateView templateDetailsData={templateDetailsData} file={null} id={null}/>
}

export default TemplateViewdetail
