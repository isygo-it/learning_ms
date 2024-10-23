// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, {BoxProps} from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'
import React, {useState} from 'react'
import {ApplicationTypeRequest} from '../../../types/apps/applicationTypes'
import {addNewApplication} from '../../../api/application'
import {useTranslation} from 'react-i18next'
import {URL_PATTERN} from '../../../types/apps/UtilityTypes'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {Avatar, InputLabel, MenuItem, Select} from '@mui/material'
import {ApplicationType} from 'template-shared/types/apps/applicationTypes'
import {checkPermission} from "template-shared/@core/api/decodedPermission";
import {PermissionAction, PermissionApplication, PermissionPage} from "template-shared/types/apps/authRequestTypes";
import {DomainType} from "template-shared/types/apps/domainTypes";
import {fetchAllDomains} from "../../../api/domain";

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  title: yup.string().required(),
  name: yup.string().required(),
  url: yup.string().matches(URL_PATTERN, 'Enter a valid url').required(),
  description: yup.string()
})

interface SidebarAddApplicationType {
  open: boolean
  toggle: () => void
  domain: string
}

const SidebarAddApplication = (props: SidebarAddApplicationType) => {
  const queryClient = useQueryClient()

  const {open, toggle, domain} = props
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }
  const {t} = useTranslation()

  const onSubmit = async (data: ApplicationTypeRequest) => {
    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
    }
    formData.append('title', data.title)
    formData.append('name', data.name)
    formData.append('url', data.url)
    formData.append('order', data.order.toString())
    formData.append('description', data.description)
    console.log(data)
    applicationMutation.mutate(formData)
  }

  const applicationMutation = useMutation({
    mutationFn: (data: FormData) => addNewApplication(data),
    onSuccess: (res: ApplicationType) => {
      console.log(res)
      handleClose()
      const cachedData: ApplicationType[] = queryClient.getQueryData('applications') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('applications', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })

  let defaultValues: ApplicationTypeRequest = {
    domain: domain,
    title: '',
    name: '',
    url: '',
    description: '',
    order: null
  }
  const {data: domainList, isLoading} = useQuery('domains', fetchAllDomains)
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

  const handleClose = () => {
    defaultValues = {
      domain: '',
      title: '',
      name: '',
      url: '',
      description: '',
      order: null
    }
    setSelectedFile(undefined)
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
        <Typography variant='h6'>{t('Application.Add_Application')}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected'}}
        >
          <Icon icon='tabler:x' fontSize='1.125rem'/>
        </IconButton>
      </Header>
      <Box sx={{p: theme => theme.spacing(0, 6, 6)}}>
        <form
          onSubmit={handleSubmit(row => {
            onSubmit(row)
          })}
        >
          <FormControl fullWidth sx={{mb: 4}}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              render={({field: {value, onChange}}) => (
                <Select
                  disabled={ checkPermission(PermissionApplication.SYSADMIN, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  <MenuItem value=''></MenuItem>
                  {!isLoading &&
                    domainList?.map((domain: DomainType) => (
                      <MenuItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='title'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
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
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
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
              rules={{required: true}}
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
            {errors.description && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
            )}
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
            <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer', display: 'flex'}}>
              <Avatar
                src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                sx={{cursor: 'pointer', mr: 2}}
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
              <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
            </label>
          </FormControl>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button type='submit' variant='contained' sx={{mr: 3}}>
              {t('Submit')}
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

export default SidebarAddApplication
