// ** React Imports
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
import {InputLabel} from '@mui/material'

import Icon from 'template-shared/@core/components/icon'

// ** Store Imports
import Select from '@mui/material/Select'

// ** Types Imports
import {useTranslation} from 'react-i18next'

import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {RoleTypes} from '../../../../types/apps/roleTypes'
import {addRole} from '../../../../api/role-account'
import {fetchAllApplications} from '../../../../api/application'
import {ApplicationType} from 'template-shared/types/apps/applicationTypes'

interface SidebarAddRoleType {
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
  name: yup.string().required(),
  description: yup.string().required()
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

const defaultValues = {
  name: '',
  description: '',
  allowedTools: [],
  rolePermission: []
}

const SidebarAddRole = (props: SidebarAddRoleType) => {
  const queryClient = useQueryClient()

  const {open, toggle} = props

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

  const {data: applicationList, isLoading} = useQuery(`applications`, () => fetchAllApplications())
  const mutation = useMutation({
    mutationFn: (data: RoleTypes) => addRole(data),
    onSuccess: (res: RoleTypes) => {
      handleClose()
      const cachedData: RoleTypes[] = queryClient.getQueryData('roles') || []
      const updatedData = [...cachedData]
      updatedData.push(res)

      queryClient.setQueryData('roles', updatedData)
    },
    onError: err => {
      console.log(err)
    }
  })
  const onSubmit = (data: RoleTypes) => {
    mutation.mutate(data)
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
        <Typography variant='h6'>{t('Role.Add_New_Role')}</Typography>
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
              name='name'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Name')}
                  onChange={onChange}
                  placeholder={t('Name') as string}
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
                  rows={4}
                  multiline
                  value={value}
                  label={t('Description')}
                  onChange={onChange}
                  placeholder={t('Description') as string}
                  id='textarea-standard-static'
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          {applicationList && applicationList.length > 0 && (
            <FormControl fullWidth sx={{mb: 4}}>
              <InputLabel id='demo-multiple-chip-label'>{t('Application.Application')}</InputLabel>
              <Controller
                name='allowedTools'
                control={control}
                rules={{required: true}}
                render={({field}) => {
                  const value: ApplicationType[] | undefined = field.value

                  return (
                    <Select
                      size='small'
                      multiple
                      label={t('Role.Roles')}
                      value={value}
                      MenuProps={MenuProps}
                      id='demo-multiple-chip'
                      onChange={event => {
                        const selectedApplications = event.target.value as ApplicationType[]
                        const lastSelectedApplications = selectedApplications[selectedApplications.length - 1]
                        const isApplicationSelected = value.some(
                          application => application.code === lastSelectedApplications.code
                        )

                        if (!isApplicationSelected) {
                          // Role is not selected, add it
                          field.onChange(selectedApplications)
                        } else {
                          // Role is already selected, remove it
                          const updatedApplications = value.filter(
                            application => application.code !== lastSelectedApplications.code
                          )
                          field.onChange(updatedApplications)
                        }
                      }}
                      labelId='demo-multiple-chip-label'
                      renderValue={selected => selected.map(application => application.name).join(', ')}
                    >
                      {applicationList?.map((application: any) => (
                        <MenuItem key={application.code} value={application}>
                          <Checkbox checked={value.some(r => r.code === application.code)}/>
                          <ListItemText primary={application.name}/>
                        </MenuItem>
                      ))}
                    </Select>
                  )
                }}
              />
            </FormControl>
          )}
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

export default SidebarAddRole
