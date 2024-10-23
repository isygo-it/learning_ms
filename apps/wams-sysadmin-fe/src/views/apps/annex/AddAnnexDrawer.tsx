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

import Icon from 'template-shared/@core/components/icon'

import React from 'react'
import {useTranslation} from 'react-i18next'
import {InputLabel} from '@mui/material'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import {useMutation, useQueryClient} from 'react-query'
import {addNewAnnex} from '../../../api/annex'
import {AnnexType, Language} from 'template-shared/types/apps/annexTypes'
import Autocomplete from '@mui/material/Autocomplete'

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  tableCode: yup.string().required(),
  language: yup.string().required(),
  value: yup.string().required(),
  description: yup.string().required(),
  reference: yup.string(),
  annexOrder: yup.string().required()
})

interface SidebarAddAnnexType {
  open: boolean
  toggle: () => void
  uniqueTableCodes: string[]
}

const SidebarAddAnnex = (props: SidebarAddAnnexType) => {
  const queryClient = useQueryClient()

  const {open, toggle, uniqueTableCodes} = props
  const {t} = useTranslation()
  const onSubmit = async (data: AnnexType) => {
    addAnnexMutation.mutate(data)
    handleClose()
  }
  const addAnnexMutation = useMutation({
    mutationFn: (params: AnnexType) => addNewAnnex(params),
    onSuccess: (res: AnnexType) => {
      const cachedData: AnnexType[] = queryClient.getQueryData('annexs') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('annexs', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })
  const defaultValues: AnnexType = {
    tableCode: '',
    language: Language.EN,
    value: '',
    description: '',
    reference: '',
    annexOrder: 0
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    toggle()
    reset()
  }

  //  const {data: domainList, isLoading, refetch} = useQuery("domains", fetchAllDomains)
  const handleInputChange = (e, data) => {
    setValue("tableCode", data)

    return data
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
        <Typography variant='h6'>{t('Annex.Add_Annex')}</Typography>
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
          onSubmit={handleSubmit((row: AnnexType) => {
            onSubmit(row)
          })}
        >
          {/*<FormControl fullWidth sx={{mb: 4}}>*/}
          {/*  <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>*/}
          {/*  <Controller*/}
          {/*    name='domain'*/}
          {/*    control={control}*/}
          {/*    rules={{required: true}}*/}
          {/*    render={({field: {value, onChange}}) => (*/}
          {/*      <Select size='small' label={t('Domain.Domain')} name='domain' defaultValue='' onChange={onChange}*/}
          {/*              value={value}>*/}
          {/*        {!isLoading && domainList.length > 0 ?*/}
          {/*          domainList.map((domain) => (*/}
          {/*            <MenuItem key={domain.code} value={domain.name}>*/}
          {/*              {domain.name}*/}
          {/*            </MenuItem>*/}
          {/*          ))*/}
          {/*          :*/}
          {/*          <MenuItem value=''>*/}
          {/*            <em>{t('None')}</em>*/}
          {/*          </MenuItem>*/}

          {/*        }*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*  {errors.domain && <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}*/}
          {/*</FormControl>*/}
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='tableCode'
              control={control}
              rules={{required:true}}
              render={({field: {value, onChange}}) => (
                <Autocomplete
                  id='code'
                  freeSolo
                  options={uniqueTableCodes}
                  value={value}
                  onChange={(e, newValue) => onChange(newValue)}
                  onInputChange={(e, data) => handleInputChange(e, data)}
                  renderInput={(params) =>
                    <TextField {...params}  label="tableCode" />
                }

                />
              )}
            />
            {errors.tableCode && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.tableCode.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='value'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  multiline
                  InputProps={{readOnly: false}}
                  label={t('Parameter.Value')}
                  onChange={onChange}
                  error={Boolean(errors.value)}
                />
              )}
            />
            {errors.value && <FormHelperText sx={{color: 'error.main'}}>{errors.value.message}</FormHelperText>}
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
                  id='form-props-read-only-input'
                  multiline
                  rows={3}
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
            <InputLabel>Language</InputLabel>
            <Controller
              name='language'
              control={control}
              defaultValue={Language.EN}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  defaultValue=''
                  size='small'
                  label='Language'
                  value={value}
                  onChange={e => onChange(e.target.value)}
                >
                  <MenuItem value='AR'>Arabic</MenuItem>
                  <MenuItem value='EN'>English</MenuItem>
                  <MenuItem value='FR'>French</MenuItem>
                  <MenuItem value='DE'>German</MenuItem>
                  <MenuItem value='IT'>Italian</MenuItem>
                </Select>
              )}
            />
            {errors.language && <FormHelperText sx={{color: 'error.main'}}>{errors.language.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='reference'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{readOnly: false}}
                  label={t('Reference')}
                  onChange={onChange}
                  error={Boolean(errors.reference)}
                />
              )}
            />
            {errors.reference && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.reference.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='annexOrder'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  id='form-props-read-only-input'
                  InputProps={{readOnly: false}}
                  label={t('Annex_Order')}
                  onChange={onChange}
                  error={Boolean(errors.annexOrder)}
                />
              )}
            />
            {errors.annexOrder && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.annexOrder.message}</FormHelperText>
            )}
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

export default SidebarAddAnnex
