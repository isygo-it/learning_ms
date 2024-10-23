// ** React Imports
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  BoxProps,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Switch,
  TextField,
  Typography
} from '@mui/material'

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

// ** Store Imports
// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Types Imports
// ** Actions Imports
import { addAccount } from '../../../../api/account'

// ** Third Party Imports
import * as yup from 'yup'

import { fetchDataRoleAccount } from 'template-shared/@core/api/account'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { DomainType } from 'template-shared/types/apps/domainTypes'
import { RoleTypes } from 'template-shared/types/apps/roleTypes'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import { getDomainNames } from 'template-shared/@core/api/domain'
import { AccountsTypes } from 'template-shared/types/apps/accountTypes'
import { checkPermission } from 'template-shared/@core/api/decodedPermission'
import { PermissionAction, PermissionApplication, PermissionPage } from 'template-shared/types/apps/authRequestTypes'
import MuiPhoneNumber from 'material-ui-phone-number'
import EmailInputMask from 'template-shared/views/forms/form-elements/input-mask/EmailInputMask'

interface SidebarAddAccountType {
  open: boolean
  toggle: () => void
  domain: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  domain: yup.string().required(),
  adminStatus: yup.string().required(),
  phoneNumber: yup.string().required(),
  roleInfo: yup.array().min(1),
  accountDetails: yup.object().shape({
    firstName: yup.string().required('First Name field is required'),
    lastName: yup.string().required('Last Name field is required')
  })
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}
const SidebarAddAccount = (props: SidebarAddAccountType) => {
  const queryClient = useQueryClient()

  const { open, toggle, domain } = props
  const { data: domainList, isFetched: isFetchedDomains } = useQuery('domains', getDomainNames)

  const { data: rolesList, isFetched: isFetchedRoles } = useQuery('roles', fetchDataRoleAccount)

  const { t } = useTranslation()

  console.log('open', open)

  const addMutation = useMutation({
    mutationFn: (data: AccountsTypes) => addAccount(data),
    onSuccess: (res: AccountsTypes) => {
      handleClose()
      const cachedData: AccountsTypes[] = queryClient.getQueryData('accounts') || []
      const updatedData = [...cachedData]
      updatedData.push(res)
      queryClient.setQueryData('accounts', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })
  const defaultValues: AccountsTypes = {
    email: '',
    domain: domain,
    adminStatus: 'ENABLED',
    isAdmin: false,
    roleInfo: [],
    phoneNumber: '',
    accountDetails: {
      firstName: '',
      lastName: ''
    }
  }
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const onSubmit = async (data: AccountsTypes) => {
    const mappeAdminStatus = data.adminStatus ? 'ENABLED' : 'DISABLED'
    const dataForm = { ...data, adminStatus: mappeAdminStatus }
    addMutation.mutate(dataForm)
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return isFetchedDomains && isFetchedRoles ? (
    <Drawer
      open={open}
      anchor='right'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Account.Add_New_Account')} </Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-simple-select-helper-label'>{t('Domain.Domain')}</InputLabel>
            <Controller
              name='domain'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  disabled={ checkPermission(PermissionApplication.SYSADMIN, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
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
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='accountDetails.firstName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  type='text'
                  label={t('First_Name')}
                  onChange={onChange}
                  value={value}
                  error={Boolean(errors.accountDetails?.firstName)}
                />
              )}
            />
            {errors.accountDetails?.firstName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.accountDetails?.firstName.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='accountDetails.lastName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  type='text'
                  label={t('Last_Name')}
                  value={value}
                  onChange={onChange}
                  error={Boolean(errors.accountDetails?.lastName)}
                />
              )}
            />
            {errors.accountDetails?.lastName && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.accountDetails?.lastName.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='phoneNumber'
              control={control}
              rules={{ required: true }}
              render={({ field: { value } }) => (
                <MuiPhoneNumber
                  variant='outlined'
                  fullWidth
                  size='small'
                  defaultCountry={'tn'}
                  countryCodeEditable={true}
                  label={t('Phone_Number')}
                  value={value}
                  onChange={e => {
                    const updatedValue = e.replace(/\s+/g, '')
                    setValue('phoneNumber', updatedValue)
                  }}
                  error={Boolean(errors.phoneNumber)}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <EmailInputMask value={value} onChange={onChange} error={Boolean(errors.email)} />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='demo-multiple-chip-label'>{t('Roles')}</InputLabel>

            <Controller
              name='roleInfo'
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <Select
                    size='small'
                    multiple
                    label={t('Roles')}
                    value={field.value}
                    MenuProps={MenuProps}
                    id='multiple-role'
                    onChange={event => {
                      const selectedRoles = event.target.value as RoleTypes[]
                      const lastSelectedRole = selectedRoles[selectedRoles.length - 1]
                      const isRoleSelected = field.value?.some(role => role.code === lastSelectedRole.code)

                      if (!isRoleSelected) {
                        field.onChange(selectedRoles)
                      } else {
                        const updatedRoles = field.value?.filter(role => role.code !== lastSelectedRole.code)
                        field.onChange(updatedRoles)
                      }
                    }}
                    labelId='multiple-role-label'
                    renderValue={selected => selected.map(role => role.name).join(', ')}
                  >
                    {rolesList?.map((role: any) => (
                      <MenuItem key={role.code} value={role}>
                        <Checkbox checked={field.value?.some(r => r.code === role.code)} />
                        <ListItemText primary={role.name} />
                      </MenuItem>
                    ))}
                  </Select>
                )
              }}
            />
            {errors.roleInfo && <FormHelperText sx={{ color: 'error.main' }}>{errors.roleInfo.message}</FormHelperText>}
          </FormControl>
          <FormControlLabel
            labelPlacement='top'
            label={t('IsAdmin')}
            control={
              <Controller
                name='isAdmin'
                control={control}
                defaultValue={defaultValues.isAdmin}
                render={({ field: { value, onChange } }) => (
                  <Switch checked={value} onChange={e => onChange(e.target.checked)} />
                )}
              />
            }
            sx={{ mb: 4, alignItems: 'flex-start', marginLeft: 0 }}
          />
          <br />
          <FormControlLabel
            labelPlacement='top'
            label={t('Admin_Status')}
            control={
              <Controller
                name='adminStatus'
                control={control}
                defaultValue={defaultValues.adminStatus}
                render={({ field: { value, onChange } }) => (
                  <Switch checked={value == 'ENABLED' ? true : false} onChange={e => onChange(e.target.checked)} />
                )}
              />
            }
            sx={{ mb: 4, alignItems: 'flex-start', marginLeft: 0 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
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

export default SidebarAddAccount
