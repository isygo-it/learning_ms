// ** React Imports
import {ReactElement, SyntheticEvent, useEffect, useState} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import {styled, Theme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, {TabListProps} from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from '../../../@core/components/icon'

// ** Types
import {PricingPlanType} from '../../../@core/components/plan-details/types'

// ** Demo Tabs Imports
import TabAccount from './TabAccount'
import TabBilling from './TabBilling'
import TabSecurity from './TabSecurity'
import TabConnections from './TabConnections'
import TabNotifications from './TabNotifications'
import {useTranslation} from 'react-i18next'
import {useQuery} from 'react-query'
import {fetchOneAccount, fetchProfileFullData} from '../../../@core/api/account'
import apiUrls from '../../../configs/apiUrl'
import {checkPermission} from '../../../@core/api/decodedPermission'
import {PermissionAction, PermissionApplication, PermissionPage} from '../../../types/apps/authRequestTypes'

const TabList = styled(MuiTabList)<TabListProps>(({theme}) => ({
    border: '0 !important',
    '& .MuiTabs-indicator': {
        display: 'none'
    },
    '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: `${theme.palette.common.white} !important`
    },
    '& .MuiTab-root': {
        minWidth: 65,
        minHeight: 38,
        lineHeight: 1,
        borderRadius: theme.shape.borderRadius,
        [theme.breakpoints.up('md')]: {
            minWidth: 130
        }
    }
}))

const AccountSettings = ({
                             tab,
                             apiPricingPlanData,
                             id
                         }: {
    tab: string
    apiPricingPlanData: PricingPlanType[]
    id: number | null
}) => {
    // ** State
    const [photo, setPhoto] = useState<string>('')

    const [activeTab, setActiveTab] = useState<string>(tab)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // ** Hooks
    const router = useRouter()
    const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const {t} = useTranslation()
    const handleChange = (event: SyntheticEvent, value: string) => {
        setIsLoading(true)
        setActiveTab(value)
        if (!id) {
            router.push(`/pages/account-settings/${value.toLowerCase()}`).then(() => setIsLoading(false))
        } else {
            router.push(`/apps/account-management/view/${value.toLowerCase()}/${id}`).then(() => setIsLoading(false))
        }
    }

    const {data: user, isLoading: isLoadingUser} = useQuery(
        `profile`,
        () => (!id ? fetchProfileFullData() : fetchOneAccount(id)),
        {
            onSuccess: data => {
                if (data?.id) {
                    setPhoto(`${apiUrls.apiUrl_IMS_AccountImageDownloadEndpoint}/${data?.id}?` + new Date().getTime())
                }
            }
        }
    )

    const [myProfile, setMyProfile] = useState(false)

    useEffect(() => {
        if (!id) {
            setMyProfile(true)
        }
        if (tab && tab !== activeTab) {
            setActiveTab(tab)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    const tabContentList: { [key: string]: ReactElement } = {
        account: <TabAccount id={id} user={user} photo={photo} setPhoto={setPhoto} myProfile={myProfile}/>,
        security: <TabSecurity user={user} myProfile={myProfile}/>,
        connections: <TabConnections/>,
        notifications: <TabNotifications/>,
        billing: <TabBilling apiPricingPlanData={apiPricingPlanData}/>
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <TabContext value={activeTab}>
                    {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT_DETAIL, PermissionAction.READ) && (
                        <Grid container spacing={6}>
                            <Grid item xs={12}>
                                <TabList
                                    variant='scrollable'
                                    scrollButtons='auto'
                                    onChange={(event, value) => handleChange(event, value)}
                                    aria-label='customized tabs example'
                                >
                                    <Tab
                                        value='account'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:users'/>
                                                {!hideText && t('Tabs.Account')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='security'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:lock'/>
                                                {!hideText && t('Tabs.Security')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='billing'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:file-text'/>
                                                {!hideText && t('Tabs.Billing')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='notifications'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:bell'/>
                                                {!hideText && t('Tabs.Notifications')}
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value='connections'
                                        label={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    ...(!hideText && {'& svg': {mr: 2}})
                                                }}
                                            >
                                                <Icon fontSize='1.25rem' icon='tabler:link'/>
                                                {!hideText && t('Tabs.Connections')}
                                            </Box>
                                        }
                                    />
                                </TabList>
                            </Grid>
                            <Grid item xs={12}>
                                {isLoading && isLoadingUser ? (
                                    <Box sx={{mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                        <CircularProgress sx={{mb: 4}}/>
                                        <Typography>Loading...</Typography>
                                    </Box>
                                ) : (
                                    <TabPanel sx={{p: 0}} value={activeTab}>
                                        {tabContentList[activeTab]}
                                    </TabPanel>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </TabContext>
            </Grid>
        </Grid>
    )
}

export default AccountSettings
