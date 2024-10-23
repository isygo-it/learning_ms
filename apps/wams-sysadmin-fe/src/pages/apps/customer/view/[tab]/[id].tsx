import React from 'react'
import {useRouter} from 'next/router'
import CustomerView from '../../../../../views/apps/customer/view/CustomerView'

const CustomerDetailView = () => {
  const router = useRouter()
  const {id} = router.query

  const customerId = id as string | undefined

  return <CustomerView id={customerId}/>
}

export default CustomerDetailView
