import React from 'react'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import {styled} from '@mui/material/styles'
import {useTranslation} from 'react-i18next'
import toast from 'react-hot-toast'
import {useMutation, useQuery} from 'react-query'
import {JobApplicationType} from '../../../../types/apps/jobApplicationType'
import {fetchJobOffersNotAssignedToResume} from '../../../api/job'
import {JobApplication} from '../../../api/resume'

const Header = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

interface ApplicationjobOfferProps {
    open: boolean
    code: string
    email: string
    toggle: () => void
}

const ApplicationjobOffer = (props: ApplicationjobOfferProps) => {
    const {open, code, email, toggle} = props
    const {t} = useTranslation()
    let selectedJobOfferCode: string = ''

    const {data: jobOfferList} = useQuery([`jobOfferList`, code], () => fetchJobOffersNotAssignedToResume(code))

    console.log('jobOfferList', jobOfferList)
    const handlejobOfferChange = event => {
        console.log('event.target.value', event.target.value)

        selectedJobOfferCode = event.target.value as string
    }

    const onSubmit = async () => {
        const data: JobApplicationType = {
            jobOffer: {code: selectedJobOfferCode},
            resume: {code: code}
        }
        console.log(data)
        JobApplicationMutation.mutate(data)
    }

    const JobApplicationMutation = useMutation({
        mutationFn: (data: JobApplicationType) => JobApplication(data),
        onSuccess: () => {
            toast.success(t('Job.Job_application_added_successfully'))
            handleClose()
        }
    })
    const handleClose = () => {
        toggle()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{keepMounted: true}}
            sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
        >
            <Header>
                <Typography variant='h6'>Add job application</Typography>
            </Header>
            <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
                <form>
                    <TextField size='small' disabled={true} value={email || ''} label={t('Email')} fullWidth
                               sx={{mb: 4}}/>
                    <FormControl fullWidth sx={{mb: 4}}>
                        <InputLabel>{t('Job Offer')}</InputLabel>
                        <Select size='small' name='jobOffre' onChange={e => handlejobOfferChange(e)}
                                label={t('Job Offer')}>
                            {jobOfferList?.length > 0 ? (
                                jobOfferList.map(jobOffer => (
                                    <MenuItem key={jobOffer.code} value={jobOffer.code}>
                                        {jobOffer.title}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value=''>{t('No job Offers Found')}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Button variant='contained' sx={{mr: 3}} onClick={onSubmit}>
                            {t('Apply')}
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            {t('Cancel')}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    )
}

export default ApplicationjobOffer
