import {useState} from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'template-shared/@core/components/icon'
import {useTranslation} from 'react-i18next'
import {useMutation} from 'react-query'
import {deleteAdditionalFile} from 'template-shared/@core/api/job'
import toast from 'react-hot-toast'

type Props = {
    open: boolean
    setOpen: (val: boolean) => void
    slectedJobId: number
    setOriginalFileName: string
    selectCodeFile: string
    handleStateDelete: (res: any) => void
}

const DeleteAdditionalFileDrawer = (props: Props) => {
    console.log(props)
    const {open, setOpen, slectedJobId, setOriginalFileName, handleStateDelete} = props

    const [jobInput] = useState<string>('yes')
    const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
    const handleClose = () => setOpen(false)

    const handleSecondDialogClose = () => {
        setSecondDialogOpen(false)
    }
    const {t} = useTranslation()
    const deleteAdditionalFileMutation = useMutation({
        mutationFn: (data: { id: number; originalFileName: string }) => deleteAdditionalFile(data),
        onSuccess: response => {
            handleStateDelete(response)
        }
    })
    const handleConfirmation = () => {
        deleteAdditionalFileMutation.mutate({id: slectedJobId, originalFileName: setOriginalFileName})
        handleClose()
        toast.success(t('Job.Job_AdditionalFile_deleted_successfully'))
    }

    return (
        <>
            <Dialog fullWidth open={open} onClose={handleClose}
                    sx={{'& .MuiPaper-root': {width: '100%', maxWidth: 512}}}>
                <DialogContent
                    sx={{
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            textAlign: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            '& svg': {mb: 8, color: 'warning.main'}
                        }}
                    >
                        <Icon icon='tabler:alert-circle' fontSize='5.5rem'/>
                        <Typography variant='h4' sx={{mb: 5, color: 'text.secondary'}}>
                            {t('Are you sure')}
                        </Typography>
                        <Typography>{t('AdditionFile_confirmation_deleted_message')}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                    }}
                >
                    <Button variant='contained' sx={{mr: 2}} onClick={() => handleConfirmation()}>
                        {t('Action.Delete')}
                    </Button>
                    <Button variant='outlined' color='secondary' onClick={() => handleClose()}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                open={secondDialogOpen}
                onClose={handleSecondDialogClose}
                sx={{'& .MuiPaper-root': {width: '100%', maxWidth: 512}}}
            >
                <DialogContent>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            '& svg': {
                                mb: 14,
                                color: jobInput === 'yes' ? 'success.main' : 'error.main'
                            }
                        }}
                    >
                        <Icon fontSize='5.5rem'
                              icon={jobInput === t('yes') ? 'tabler:circle-check' : 'tabler:circle-x'}/>
                        <Typography variant='h4' sx={{mb: 8}}>
                            {jobInput === 'yes' ? 'Suspended!' : 'Cancelled'}
                        </Typography>
                        <Typography>
                            {jobInput === t('yes') ? t('Resume.resume_has_been_suspended') : t('Cancelled Suspension')}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{justifyContent: 'center'}}>
                    <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
                        {t('OK')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteAdditionalFileDrawer
