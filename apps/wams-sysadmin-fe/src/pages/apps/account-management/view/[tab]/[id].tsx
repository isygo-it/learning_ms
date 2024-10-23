import AccountSettings from 'template-shared/views/pages/account-settings/AccountSettings'
import {useRouter} from 'next/router'
import {useQuery} from 'react-query'
import {fetchOneAccount} from '../../../../../api/account'
import React from 'react'

const AccountView = () => {
  const router = useRouter()
  const {id} = router.query
  const {
    data: accountDetailsData,
    isError,
    isLoading
  } = useQuery(['accountDetailsData', id], () => fetchOneAccount(Number(id)), {})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !accountDetailsData) {
    return <div>Error loading account data</div>
  }

  return <AccountSettings tab='account' apiPricingPlanData={accountDetailsData} id={Number(id)}/>
}
export default AccountView
