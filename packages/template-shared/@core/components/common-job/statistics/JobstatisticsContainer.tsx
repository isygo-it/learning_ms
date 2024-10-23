// ResumeStatisticsContainer.tsx
import React from 'react';

import Grid from '@mui/material/Grid';
import {useQuery} from "react-query";
import {fetchAllJobStat} from "template-shared/@core/api/jobStatistic";
import StatisticCard from "../../../../views/components/staticCard/CardStatistic";

enum JobStatEnum {
    TOTAL_COUNT = 'TOTAL_COUNT',
    ACTIVE_COUNT = 'ACTIVE_COUNT',
    CONFIRMED_COUNT = 'CONFIRMED_COUNT',
    EPIRED_COUNT = 'EXPIRED_COUNT'

}

const JobStatisticsContainer: React.FC = () => {
    const {
        data: totalCount,
        isLoading: isLoadingTotalCount
    } = useQuery(['totalCount'], () => fetchAllJobStat(JobStatEnum.TOTAL_COUNT));
    const {
        data: activeCount,
        isLoading: isLoadingActiveCount
    } = useQuery(['activeCount'], () => fetchAllJobStat(JobStatEnum.ACTIVE_COUNT));
    const {
        data: confirmedCount,
        isLoading: isLoadingConfirmedCount
    } = useQuery(['confirmedCount'], () => fetchAllJobStat(JobStatEnum.CONFIRMED_COUNT));
    const {
        data: expiredCount,
        isLoading: isLoadingExpiredCount
    } = useQuery(['confirmedCount'], () => fetchAllJobStat(JobStatEnum.EPIRED_COUNT));


    return (
        <Grid container spacing={2} sx={{mb: 2}}>
            <Grid item xs={12} sm={3}>
                <StatisticCard title="Statistic.JobOffers"
                               value={totalCount?.totalCount || 0}
                               avatarColor="primary"
                               avatarIcon="uis:bag"
                               loading={isLoadingTotalCount}
                               description={'Statistic.JobOffers_desc'}/>
            </Grid>
            <Grid item xs={12} sm={3}>
                <StatisticCard title="Statistic.Active"
                               description={'Statistic.Active_JobOffers_Desc'}
                               value={activeCount?.activeCount || 0}
                               avatarColor="primary"
                               avatarIcon="bi:bag-check"
                               loading={isLoadingActiveCount}/>
            </Grid>
            <Grid item xs={12} sm={3}>
                <StatisticCard title="Statistic.Done"
                               description={'Statistic.Done_Desc'}
                               value={confirmedCount?.confirmedCount || 0}
                               avatarColor="primary"
                               avatarIcon="bi:bag-heart"
                               loading={isLoadingConfirmedCount}/>
            </Grid>
            <Grid item xs={12} sm={3}>
                <StatisticCard title="Statistic.Expired"
                               description={'Statistic.Expired_JobOffer_Desc'}
                               value={expiredCount?.expiredCount || 0}
                               avatarColor="primary"
                               avatarIcon="uil:bag-slash"
                               loading={isLoadingExpiredCount}/>
            </Grid>
        </Grid>
    );
};

export default JobStatisticsContainer;
