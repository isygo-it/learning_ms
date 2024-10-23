import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import {Box} from '@mui/material'
import {useMutation, useQueryClient} from 'react-query'

import {addNewjobTemplate} from 'template-shared/@core/api/job-template'

import {JobOfferType} from 'template-shared/types/apps/jobOfferTypes'
import {JobTemplate} from 'template-shared/types/apps/jobTemplateTypes'
import {useTranslation} from 'react-i18next'
import toast from 'react-hot-toast'

type Props = {
    open: boolean
    setOpen: (val: boolean) => void
    job: JobOfferType
    handleRowOptionsClose: () => void
}

const TemplateJobDrawer = (props: Props) => {
    const queryClient = useQueryClient()
    const {t} = useTranslation()
    const {open, setOpen, job, handleRowOptionsClose} = props
    const updateTemplate = useMutation({
        mutationFn: (data: JobTemplate) => addNewjobTemplate(data),
        onSuccess: (res: any) => {
            if (res) {
                const cashedData = (queryClient.getQueryData('jobTemplates') as any[]) || []

                const newData = [...cashedData, res]

                toast.success(t('Template.Template_Marked_AS_Template'))
                queryClient.setQueryData('jobTemplates', newData)
            }

            handleClose()
        },
        onError: err => {
            console.log(err)
        }
    })

    let title = ''
    const handleClose = () => {
        setOpen(false)
        handleRowOptionsClose()
    }
    const submit = () => {
        const jobTemplate: JobTemplate = {domain: 'novobit.eu', title: title, jobOffer: job}
        updateTemplate.mutate(jobTemplate)
    }

    function handleTitleChang(newTitle: string) {
        title = newTitle
    }

    return (
        <Dialog fullWidth open={open} onClose={handleClose} sx={{'& .MuiPaper-root': {width: '100%', maxWidth: 512}}}>
            <DialogTitle id='alert-dialog-title'>{t('Action.Mark_as_Template')}</DialogTitle>
            <DialogContent sx={{mt: 2}}>
                <TextField size='small' onChange={e => handleTitleChang(e.target.value)} placeholder={t('Title')}
                           fullWidth/>
                <Box sx={{p: 0, position: 'relative', overflowX: 'hidden', height: 'calc(100% - 7.625rem)'}}></Box>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
                <Button onClick={submit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default TemplateJobDrawer
