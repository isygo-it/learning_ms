import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import {useQuery} from 'react-query'
import {fetchJobStatByCode} from '../../../../@core/api/jobStatistic'
import {statisticJobType} from '../../../../types/apps/statisticJobTypes'
import StatisticCard from "../../../components/staticCard/CardStatistic";

const StatisticsByJobContainer: React.FC<{ codeJob: string }> = ({codeJob}) => {
    const {data: jobStat, isLoading: isLoadingStat} = useQuery<statisticJobType>(['jobStat'], () =>
        fetchJobStatByCode(codeJob)
    )

    const {completion, applicationCount, selectedProfilesCount, interviewedProfilesCount, rejectedProfilesCount} =
    jobStat || {}

    return (
        <Card>
            <CardHeader title='Statistics'/>
            <Grid container spacing={2} padding={2}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatisticCard
                        title="Statistic.Completed"
                        value={completion || 0}
                        avatarColor="error"
                        avatarIcon="tabler:currency-dollar"
                        loading={isLoadingStat}
                        description={'Statistic.JobOffer_Complete_data'}
                    />

                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatisticCard title="Statistic.Applications"
                                   value={applicationCount || 0}
                                   avatarColor="warning"
                                   avatarIcon="tabler:upload"
                                   loading={isLoadingStat}
                                   description={'Statistic.Applications_Desc'}/>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatisticCard title='Statistic.Selected_Profiles'
                                   value={selectedProfilesCount || 0}
                                   avatarColor="info"
                                   avatarIcon="tabler:clipboard-check"
                                   loading={isLoadingStat}
                                   description={'Statistic.Selected_Profile_Desc'}/>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatisticCard title='Statistic.Interviewed_Profiles'
                                   value={interviewedProfilesCount || 0}
                                   avatarColor="success"
                                   avatarIcon="tabler:clipboard-check"
                                   loading={isLoadingStat}
                                   description={'Statistic.Interviewed_Profiles_Dec'}/>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatisticCard title='Statistic.Rejected_Profiles'
                                   value={rejectedProfilesCount || 0}
                                   avatarColor="error"
                                   avatarIcon="tabler:message-circle"
                                   loading={isLoadingStat}
                                   description={'Statistic.Rejected_Profiles_Desc'}/>
                </Grid>
            </Grid>
        </Card>
    )
}

export default StatisticsByJobContainer
