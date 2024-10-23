import {Avatar, Box, Button, FormControl, FormHelperText, IconButton, TextField, Typography} from '@mui/material'
import Drawer from '@mui/material/Drawer'
import {styled} from '@mui/material/styles'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React from 'react'
import {updateApplicationById} from '../../../api/application'
import {useTranslation} from 'react-i18next'
import {URL_PATTERN} from '../../../types/apps/UtilityTypes'
import {useMutation, useQueryClient} from 'react-query'
import {ApplicationType} from 'template-shared/types/apps/applicationTypes'
import apiUrls from 'template-shared/configs/apiUrl'

const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  url: yup.string().matches(URL_PATTERN, 'Enter a valid url').required(),
  description: yup.string()
})

interface SidebarEditApplicationType {
  open: boolean
  dataApplication: ApplicationType | undefined
  toggle: () => void
  selectedFile: File | undefined
  setSelectedFile: (file: File | undefined) => void
}

const SidebarEditApplication = (props: SidebarEditApplicationType) => {
  console.log(props)
  const queryClient = useQueryClient()

  // ** Props
  const {open, toggle, dataApplication, selectedFile, setSelectedFile} = props

  const defaultValues = {...dataApplication}

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const {t} = useTranslation()

  const applicationMutation = useMutation({
    mutationFn: (data: FormData) => updateApplicationById(data),
    onSuccess: (res: ApplicationType) => {
      handleClose()
      const cachedApplication: ApplicationType[] = queryClient.getQueryData('applications') || []
      const index = cachedApplication.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedApplications = [...cachedApplication]
        updatedApplications[index] = res
        queryClient.setQueryData('applications', updatedApplications)
      }
    }
  })

  const onSubmit = async (data: ApplicationType) => {
    const formData = new FormData()
    console.log('Selected file ', selectedFile)
    if (typeof selectedFile != 'undefined') {
      formData.append('file', selectedFile)
    }
    if (data.id && data.code && data.name && data.url && data.title) {
      formData.append('id', data.id.toString())
      formData.append('title', data.title)
      formData.append('name', data.name)
      formData.append('code', data.code)
      formData.append('url', data.url)
      formData.append('order', data.order.toString())
      if (data.description) {
        formData.append('description', data.description)
      }
      if (data.imagePath && selectedFile == undefined) {
        formData.append('imagePath', data.imagePath)
      }
      setSelectedFile(undefined)
      applicationMutation.mutate(formData)
    }
  }

  const handleClose = () => {
    toggle()
    reset()
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
        <Typography variant='h6'>{t('Application.Edit_Application')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='title'
              control={control}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  InputProps={{readOnly: false}}
                  label={t('Title')}
                  onChange={onChange}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && <FormHelperText sx={{color: 'error.main'}}>{errors.title.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='name'
              control={control}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  InputProps={{readOnly: false}}
                  label={t('Name')}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='description'
              control={control}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  multiline
                  rows={3}
                  id='form-props-read-only-input'
                  InputProps={{readOnly: false}}
                  label={t('Description')}
                  onChange={onChange}
                  error={Boolean(errors.description)}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='url'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Url')}
                  onChange={onChange}
                  error={Boolean(errors.url)}
                />
              )}
            />
            {errors.url && <FormHelperText sx={{color: 'error.main'}}>{errors.url.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='order'
              control={control}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  InputProps={{readOnly: false}}
                  label={t('Order')}
                  onChange={onChange}
                  error={Boolean(errors.order)}
                />
              )}
            />
            {errors.order && <FormHelperText sx={{color: 'error.main'}}>{errors.order.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='imagePath'
              control={control}
              rules={{required: true}}
              render={() => (
                <label style={{display: 'flex'}}>
                  <input
                    type='file'
                    name='image'
                    accept='image/jpeg, image/png'
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                  />
                  <Avatar
                    src={
                      selectedFile
                        ? URL.createObjectURL(selectedFile)
                        : `${apiUrls.apiUrl_IMS_ApplicationImageDownloadEndpoint}/${dataApplication?.id}`
                    }
                    sx={{cursor: 'pointer', marginRight: 2}}
                  ></Avatar>

                  <Button
                    color='primary'
                    variant='outlined'
                    component='span'
                    sx={{width: '100%'}}
                    startIcon={<Icon icon='tabler:upload'/>}
                  >
                    {t('Photo')}
                  </Button>
                </label>
              )}
            />
            {errors.imagePath && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.imagePath.message}</FormHelperText>
            )}
          </FormControl>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarEditApplication
