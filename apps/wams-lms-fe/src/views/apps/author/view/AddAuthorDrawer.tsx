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
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation, useQuery, useQueryClient} from 'react-query'

import Icon from "template-shared/@core/components/icon";
import {addNewAuthor} from "./index";
import {AuthorTypes} from "../../../../types/apps/authorTypes";
import {Avatar, InputLabel} from "@mui/material";
import Select from "@mui/material/Select";
import {checkPermission} from "template-shared/@core/api/decodedPermission";
import {PermissionAction, PermissionApplication, PermissionPage} from "template-shared/types/apps/authRequestTypes";
import {DomainType} from "template-shared/types/apps/domainTypes";
import MenuItem from "@mui/material/MenuItem";
import {getDomainNames} from "template-shared/@core/api/domain";
import MuiPhoneNumber from "material-ui-phone-number";
import EmailInputMask from "template-shared/views/forms/form-elements/input-mask/EmailInputMask";

const Header = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().required(),
    phone: yup.string().required(),

})

interface SidebarAddTopicType {
    open: boolean
    toggle: () => void
}



const SidebarAddTopic = (props: SidebarAddTopicType) => {
    const queryClient = useQueryClient()
    const {open, toggle} = props
    const {t} = useTranslation()
  const {data: domainList, isLoading: isLoadingDomain} = useQuery('domains', getDomainNames)

  const mutationAdd = useMutation({
    mutationFn: (data: FormData) => addNewAuthor(data),
    onSuccess: (res: AuthorTypes) => {
      handleClose();
      const cachedData: AuthorTypes[] = queryClient.getQueryData('AuthorLists') || [];
      const updatedData = [...cachedData, res];
      queryClient.setQueryData('AuthorLists', updatedData);
    },
    onError: err => {
      console.log(err);
    }
  });
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }


  const onSubmit = async (data: AuthorTypes) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);
    }
    formData.append('domain', data.domain);
    formData.append('firstname', data.firstname);
    formData.append('lastname', data.lastname);
    formData.append('email', data.email);
    formData.append('phone', data.phone);

    mutationAdd.mutate(formData);
  };

    let defaultValues: AuthorTypes = {
      domain:'',
      code: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      imagePath: '',

    }

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const handleClose = () => {
        defaultValues = {
          domain:'',
          code: '',
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          imagePath: '',

        }
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
        <Typography variant='h6'>{t('Add Author')}</Typography>
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
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <Select
                  disabled={checkPermission(PermissionApplication.SYSADMIN, PermissionPage.DOMAIN, PermissionAction.WRITE) ? false : true}
                  size='small'
                  label={t('Domain.Domain')}
                  name='domain'
                  defaultValue=''
                  onChange={onChange}
                  value={value}
                >
                  {!isLoadingDomain && domainList?.length > 0
                    ? domainList?.map((domain: DomainType) => (
                      <MenuItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              )}
            />
            {errors.domain &&
              <FormHelperText sx={{color: 'error.main'}}>{errors.domain.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='firstname'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Firstname')}
                  onChange={onChange}
                  error={Boolean(errors.firstname)}
                />
              )}
            />
            {errors.firstname && <FormHelperText sx={{color: 'error.main'}}>{errors.firstname.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='lastname'
              control={control}
              rules={{required: true}}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Lastname')}
                  onChange={onChange}
                  error={Boolean(errors.lastname)}
                />
              )}
            />
            {errors.lastname && <FormHelperText sx={{color: 'error.main'}}>{errors.lastname.message}</FormHelperText>}
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
            <Controller
              name='phone'
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
                    setValue('phone', updatedValue)
                  }}
                  error={Boolean(errors.phone)}
                />
              )}
            />
            {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
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
  );
}

export default SidebarAddTopic
