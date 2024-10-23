import React from 'react'
import {useRouter} from 'next/router'
import DomainView from '../../../../../views/apps/domain/DomainView'
import {useQuery} from 'react-query'
import {fetchOneDomain} from '../../../../../api/domain'

const CustomerDetailView = () => {
  const router = useRouter()
  const {id} = router.query
  const {
    data: domainDetail,
    isError,
    isLoading
  } = useQuery(['domainDetail', id], () => fetchOneDomain(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !domainDetail) {
    return <div>Error loading account data</div>
  }

  return <DomainView domainDetail={domainDetail}/>
}

export default CustomerDetailView
