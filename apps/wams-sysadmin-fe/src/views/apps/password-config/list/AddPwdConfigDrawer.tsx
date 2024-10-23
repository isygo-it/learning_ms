// ** React Imports
// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
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
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {fetchAllDomains} from '../../../../api/domain'
import {addPasswordConfig} from '../../../../api/password-config'
import {ConfigpasswordData, ConfigpasswordType, ConfigpasswordTypes} from '../../../../types/apps/configpasswordTypes'
import {DomainType} from 'template-shared/types/apps/domainTypes'
import {checkPermission} from "template-shared/@core/api/decodedPermission";
import {PermissionAction, PermissionApplication, PermissionPage} from "template-shared/types/apps/authRequestTypes";

interface SidebarAddPwdConfigType {
  open: boolean
  toggle: () => void
}

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  pattern: yup.string().required(),
  initialPassword: yup.string().required()
})

const defaultValues = {
  domain: '',
  pattern: '',
  initialPassword: ''
}

const SidebarAddPwdConfig = (props: SidebarAddPwdConfigType) => {
  const queryClient = useQueryClient()

  const {open, toggle} = props

  // ** Hooks
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
    mutationFn: (data: ConfigpasswordData) => addPasswordConfig(data),
    onSuccess: (res: ConfigpasswordType) => {
      handleClose()
      const cachedData: ConfigpasswordType[] = queryClient.getQueryData('passwordConfigs') || []
      const updatedData = [...cachedData]
      updatedData.push(res)

      queryClient.setQueryData('passwordConfigs', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })
  const onSubmit = (data: ConfigpasswordTypes) => {
    const dataForm: ConfigpasswordData = {...data, charSetType: 'ALL'}
    mutation.mutate(dataForm)
  }

  const {t} = useTranslation()

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
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant='h6'>{t('Password.Add_New_Password_Config')}</Typography>
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
              name='pattern'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Password.Pattern')}
                  onChange={onChange}
                  placeholder='enter your pattern'
                  error={Boolean(errors.pattern)}
                />
              )}
            />
            {errors.pattern && <FormHelperText sx={{color: 'error.main'}}>{errors.pattern.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='initialPassword'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Password.Password')}
                  onChange={onChange}
                  placeholder='enter your password'
                  error={Boolean(errors.initialPassword)}
                />
              )}
            />
            {errors.initialPassword && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.initialPassword.message}</FormHelperText>
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
  ) : null
}

export default SidebarAddPwdConfig
