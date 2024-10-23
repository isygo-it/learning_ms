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
import {deleteAdditionalFile} from '../../../api/resume'
import toast from 'react-hot-toast'

type Props = {
    open: boolean
    setOpen: (val: boolean) => void
    setSelectedResume: number
    setOriginalFileName: string
    handleStateDelete: (res) => void
}

const DeleteAdditionalFileDrawer = (props: Props) => {
    const {open, setOpen, setSelectedResume, setOriginalFileName, handleStateDelete} = props
    const [resumeInput, setresumeInput] = useState<string>('yes')
    const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
    const handleClose = () => setOpen(false)

    const handleSecondDialogClose = () => setSecondDialogOpen(false)
    const {t} = useTranslation()
    const handleConfirmation = () => {
        //dispatch(deleteAdditionalFile({id: setSelectedResume, originalFileName: setOriginalFileName}))
        deleteAdditionalFileMutation.mutate({id: setSelectedResume, originalFileName: setOriginalFileName})
    }

    const deleteAdditionalFileMutation = useMutation({
        mutationFn: (data: { id: number; originalFileName: string }) => deleteAdditionalFile(data),
        onSuccess: res => {
            toast.success(t('Job.Job_AdditionalFile_deleted_successfully'))
            handleStateDelete(res)
            handleClose()
            setresumeInput('')
        }
    })

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
                        <Typography>You want to delete this additional file</Typography>
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
                                color: resumeInput === 'yes' ? 'success.main' : 'error.main'
                            }
                        }}
                    >
                        <Icon fontSize='5.5rem'
                              icon={resumeInput === t('yes') ? 'tabler:circle-check' : 'tabler:circle-x'}/>
                        <Typography variant='h4' sx={{mb: 8}}>
                            {resumeInput === 'yes' ? 'Suspended!' : 'Cancelled'}
                        </Typography>
                        <Typography>
                            {resumeInput === t('yes') ? t('Resume.resume_has_been_suspended') : t('Cancelled Suspension')}
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
