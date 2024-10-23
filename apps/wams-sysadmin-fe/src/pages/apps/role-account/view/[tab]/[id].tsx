// ** Next Import
import RoleView from '../../../../../views/apps/role-account/view/RoleView'
import {useQuery} from 'react-query'
import {getDetailRole} from '../../../../../api/role-account'
import {useRouter} from 'next/router'
import React from 'react'
import {fetchAllApplications} from '../../../../../api/application'

const RoleViewdetail = () => {
  const router = useRouter()
  const {id} = router.query
  const {
    data: roleDetailsData,
    isError,
    isLoading
  } = useQuery(['roleDetailsData', id], () => getDetailRole(Number(id)), {})
  const {
    data: applicationList,
    isLoading: isLoadingRole,
    isError: isErrorRole
  } = useQuery(`applications`, () => fetchAllApplications())

  if (isLoading && isLoadingRole) {
    return <div>Loading...</div>
  }

  if (isError || !roleDetailsData || isErrorRole) {
    return <div>Error loading role data</div>
  }

  return (
    <RoleView applicationList={applicationList} roleDetailsData={roleDetailsData}/>

  )
}

export default RoleViewdetail
