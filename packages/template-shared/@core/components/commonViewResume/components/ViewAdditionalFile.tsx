import React, {Fragment, useState} from 'react'
import {AdditionalFiles} from '../../../../types/apps/ResumeDetails'
import {useDropzone} from 'react-dropzone'
import Icon from 'template-shared/@core/components/icon'
import {Accordion, ListItem} from '@mui/material'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box, {BoxProps} from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import {useTranslation} from 'react-i18next'
import DeleteAdditionalFileDrawer from '../list/DeleteAdditionalFileDrawer'
import useUpdateProperty from 'template-shared/hooks/useUpdateProperty'
import {useMutation} from 'react-query'
import {downloadAdditionalFile, updateAdditionalFile} from '../../../api/resume'

interface FileProp {
    name: string
    type: string
    size: number
}

interface AdditionalFilesDetails {
    id: number
    additionalFilesDetails: AdditionalFiles[]
    displayed: boolean
    onDataFromChild: (files: AdditionalFiles[]) => void
}

const DropzoneWrapper = styled(Box)<BoxProps>(({theme}) => ({
    '&.dropzone, & .dropzone': {
        minHeight: 170,
        display: 'flex',
        flexWrap: 'wrap',
        cursor: 'pointer',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        borderRadius: theme.shape.borderRadius,
        border: `2px dashed ${theme.palette.divider}`,
        [theme.breakpoints.down('xs')]: {
            textAlign: 'center'
        },
        '&:focus': {
            outline: 'none'
        },
        '& + .MuiList-root': {
            padding: 0,
            marginTop: theme.spacing(6.25),
            '& .MuiListItem-root': {
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: theme.shape.borderRadius,
                padding: theme.spacing(2.5, 2.4, 2.5, 6),
                border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
                '& .file-details': {
                    display: 'flex',
                    alignItems: 'center'
                },
                '& .file-preview': {
                    display: 'flex',
                    marginRight: theme.spacing(3.75),
                    '& svg': {
                        fontSize: '2rem'
                    }
                },
                '& img': {
                    width: 38,
                    height: 38,
                    padding: theme.spacing(0.75),
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`
                },
                '& .file-name': {
                    fontWeight: 600
                },
                '& + .MuiListItem-root': {
                    marginTop: theme.spacing(3.5)
                }
            },
            '& + .buttons': {
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: theme.spacing(6.25),
                '& > :first-of-type': {
                    marginRight: theme.spacing(3.5)
                }
            }
        },
        '& img.single-file-image': {
            objectFit: 'cover',
            position: 'absolute',
            width: 'calc(100% - 1rem)',
            height: 'calc(100% - 1rem)',
            borderRadius: theme.shape.borderRadius
        }
    }
}))
const ViewAdditionalFile = (props: AdditionalFilesDetails) => {
    const {t} = useTranslation()
    const {id, additionalFilesDetails, displayed, onDataFromChild} = props
    const [filesAdditional, setFilesAdditional] = useState<File[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
    const [selectedAdditionalFile, setSelectedAdditionalFile] = useState<string | null>(null)
    const {handleSaveChangeWithName} = useUpdateProperty({guiName: 'ResumeDetails'})

    function onUploadAdditionlFile() {
        if (filesAdditional?.length > 0) {
            //   dispatch(updateAdditionalFile({id: id, files: filesAdditional}))
            updateAdditionalFileMutation.mutate({id: id, files: filesAdditional})

            setFilesAdditional([])
        }
    }

    const updateAdditionalFileMutation = useMutation({
        mutationFn: (data: { id: number; files: Blob[] }) => updateAdditionalFile(data),
        onSuccess: (res: any) => {
            onDataFromChild(res)
        }
    })

    function downloadAdditionalFiles(originalFileName: string) {
        downloadAdditionaFileMutation.mutate(originalFileName)
    }

    const downloadAdditionaFileMutation = useMutation({
        mutationFn: (data: string) => downloadAdditionalFile(data),
        onSuccess: () => {
        }
    })

    function deleteAdditionalFiles(originalFileName: string) {
        setDeleteDialogOpen(true)
        setSelectedAdditionalFile(originalFileName)
        setSelectedResumeId(id)
    }

    const {getRootProps: getRootAdditionalProps, getInputProps: getInputAdditionalProps} = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            console.log(acceptedFiles)
            setFilesAdditional(filesAdditional.concat(acceptedFiles))
        }
    })
    const renderFilePreview = (file: FileProp) => {
        if (file?.type?.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)}/>
        } else {
            return <Icon icon='tabler:file-description'/>
        }
    }
    const handleRemoveAdditionalFile = (file: FileProp) => {
        const filtered = filesAdditional.filter((i: FileProp) => i.name !== file.name)
        setFilesAdditional([...filtered])
    }

    const handleStateDelete = data => {
        console.log('data result', data)

        if (data.id) {
            const filesAfterDeleted = additionalFilesDetails.filter(file => file.originalFileName !== data.originalFileName)
            onDataFromChild(filesAfterDeleted)
        }
    }

    const resumeAdditionalFiles = additionalFilesDetails?.map((file: any) => (
        <ListItem
            key={file.id}
            style={{
                justifyContent: 'space-between',
                borderRadius: '6px',
                padding: '0.625rem 0.6rem 0.625rem 1.5rem',
                border: '1px solid rgba(93, 89, 98, 0.14)'
            }}
        >
            <div className='file-details' style={{display: 'flex'}}>
                <div className='file-preview' style={{marginRight: '0.9375rem', fontSize: '2rem'}}>
                    <Icon style={{fontSize: '2rem'}} icon='tabler:file-description'/>
                </div>
                <div>
                    <Typography className='file-name' style={{fontWeight: '600'}}>
                        {file.originalFileName}
                    </Typography>
                    <Typography className='file-size' variant='body2'>
                        {file.size} kb
                    </Typography>
                    <small></small>
                </div>
            </div>
            <div>
                <Tooltip title={t('Action.Download')}>
                    <IconButton
                        size='small'
                        sx={{color: 'text.secondary'}}
                        onClick={() => downloadAdditionalFiles(file.originalFileName)}
                    >
                        <Icon icon='material-symbols:download'/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('Action.Delete')}>
                    <IconButton
                        size='small'
                        sx={{color: 'text.secondary'}}
                        onClick={() => deleteAdditionalFiles(file.originalFileName)}
                    >
                        <Icon icon='tabler:trash'/>
                    </IconButton>
                </Tooltip>
            </div>
        </ListItem>
    ))
    const handleRemoveAllAdditionalFiles = () => {
        setFilesAdditional([])
    }
    const fileAdditionalList = filesAdditional.map((file: FileProp) => (
        <ListItem key={file.name}>
            <div className='file-details'>
                <div className='file-preview'>{renderFilePreview(file)}</div>
                <div>
                    <Typography className='file-name'>{file.name}</Typography>
                    <Typography className='file-size' variant='body2'>
                        {Math.round(file.size / 100) / 10 > 1000
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </Typography>
                </div>
            </div>
            <IconButton onClick={() => handleRemoveAdditionalFile(file)}>
                <Icon icon='tabler:x' fontSize={20}/>
            </IconButton>
        </ListItem>
    ))

    return (
        <>
            <Accordion  className={'accordion-expanded'}
                onChange={(e, expended) => handleSaveChangeWithName(expended, 'AdditionnalFile')}
                defaultExpanded={displayed}
            >
                <AccordionSummary
                    expandIcon={<Icon icon='tabler:chevron-down'/>}
                    id='form-layouts-collapsible-header-1'
                    aria-controls='form-layouts-collapsible-content-1'
                >
                    <Typography variant='subtitle1' sx={{fontWeight: 500}}>
                        {t('Additional files')}
                    </Typography>
                </AccordionSummary>
                <Divider sx={{m: '0 !important'}}/>
                <AccordionDetails>
                    {/* ... (other fields and sections) */}
                    <Grid item xs={12} sm={12} md={12}>
                        <Card sx={{height: '100%'}}>
                            <CardContent>
                                <DropzoneWrapper style={{minHeight: 170}}>
                                    <Fragment>
                                        <div {...getRootAdditionalProps({className: 'dropzone'})}>
                                            <input {...getInputAdditionalProps()} />
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    textAlign: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <Icon icon='tabler:upload' fontSize='1.75rem'/>
                                                <Typography variant='h4' sx={{mb: 2.5}}>
                                                    Drop files here or click to upload.
                                                </Typography>
                                                <Typography sx={{color: 'text.secondary'}}>
                                                    (You can upload your resume on multiple languages.)
                                                </Typography>
                                            </Box>
                                        </div>
                                        <List>{fileAdditionalList}</List>
                                        {filesAdditional.length > 0 ? (
                                            <>
                                                <div className='buttons'>
                                                    <Button color='error' variant='outlined'
                                                            onClick={handleRemoveAllAdditionalFiles}>
                                                        Remove All
                                                    </Button>
                                                    <Button variant='contained' onClick={onUploadAdditionlFile}>
                                                        Upload Files
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <List
                                            style={{
                                                padding: '0',
                                                marginTop: '1.5625rem'
                                            }}
                                        >
                                            {resumeAdditionalFiles}
                                        </List>
                                    </Fragment>
                                </DropzoneWrapper>
                            </CardContent>
                        </Card>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <DeleteAdditionalFileDrawer
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                setSelectedResume={selectedResumeId}
                setOriginalFileName={selectedAdditionalFile}
                handleStateDelete={handleStateDelete}
            />
        </>
    )
}

export default ViewAdditionalFile
