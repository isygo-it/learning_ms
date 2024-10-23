// ** React Imports
import React, {useState} from 'react'

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

// ** Third Party Imports
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Store Imports
// ** Actions Imports
// ** Types Imports
import {useTranslation} from 'react-i18next'
import {InputLabel} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {fetchAllDomains} from '../../../../api/domain'
import {createTemplate} from '../../../../api/template'
import {DomainType} from 'template-shared/types/apps/domainTypes'
import {TemplateType, TemplateTypes} from '../../../../types/apps/templateTypes'
import {PermissionAction, PermissionApplication, PermissionPage} from "template-shared/types/apps/authRequestTypes";
import {checkPermission} from "template-shared/@core/api/decodedPermission";

interface SidebarAddTemplateType {
  open: boolean
  toggle: () => void
  domain: string
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required()
})


const SidebarAddTemplate = (props: SidebarAddTemplateType) => {
  const queryClient = useQueryClient()

  const {open, toggle, domain} = props

  const defaultValues: { domain: string; name: string; description: string; file: File | undefined } = {
    domain: domain,
    name: '',
    description: '',
    file: undefined
  }

  // ** Hooks
  const {t} = useTranslation()
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

  const {data: domainList, isLoading} = useQuery(`domains`, () => fetchAllDomains())
  const mutation = useMutation({
    mutationFn: (data: TemplateTypes) => createTemplate(data),
    onSuccess: (res: TemplateType) => {
      handleClose()
      const cachedData: TemplateType[] = queryClient.getQueryData('templates') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('templates', updatedData)
    }
  })
  const onSubmit = (data: TemplateTypes) => {
    if (selectedFile) {
      data.file = selectedFile
      mutation.mutate(data)
    }
  }

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return !isLoading ? (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Template.Add_New_Template')}</Typography>
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
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{required: true}}
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
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domainList?.map((domain: DomainType) => (
                    <MenuItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
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
                  placeholder='name'
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
              rules={{required: false}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  rows={4}
                  multiline
                  value={value}
                  label={t('Template.description')}
                  onChange={onChange}
                  placeholder='descrption'
                  id='textarea-standard-static'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <label htmlFor='file' style={{alignItems: 'center', cursor: 'pointer'}}>
              <Button
                color='primary'
                variant='outlined'
                component='span'
                sx={{width: '100%'}}
                startIcon={<Icon icon='tabler:upload'/>}
              >
                {t('Template.Template')}
              </Button>
              <input type='file' name='file' id='file' style={{display: 'none'}} onChange={handleFileChange}/>
              <a>{selectedFile ? selectedFile.name : ''}</a>
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
  ) : null
}

export default SidebarAddTemplate
