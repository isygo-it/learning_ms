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
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {Avatar, InputLabel} from '@mui/material'

import {TopicTypes} from "../../../../types/apps/topicTypes";
import Icon from "template-shared/@core/components/icon";
import {getDomainNames} from "template-shared/@core/api/domain";
import {DomainType} from "template-shared/types/apps/domainTypes";
import {PermissionAction, PermissionApplication, PermissionPage} from "template-shared/types/apps/authRequestTypes";
import {checkPermission} from "template-shared/@core/api/decodedPermission";
import {addNewTopic} from "./index";

const Header = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    domain: yup.string().required(),
})

interface SidebarAddTopicType {
    open: boolean
    toggle: () => void
    domain: string
}



const SidebarAddTopic = (props: SidebarAddTopicType) => {
    const queryClient = useQueryClient()
    const {open, toggle, domain} = props
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
  }
    const {t} = useTranslation()



    const {data: domainList, isLoading: isLoadingDomain} = useQuery('domains', getDomainNames)
  const mutationAdd = useMutation({
    mutationFn: (data: FormData) => addNewTopic(data),
    onSuccess: (res: TopicTypes) => {
      handleClose();
      const cachedData: TopicTypes[] = queryClient.getQueryData('TopicLists') || [];
      const updatedData = [...cachedData, res];
      queryClient.setQueryData('TopicLists', updatedData);
    },
    onError: err => {
      console.log(err);
    }
  });

  const onSubmit = async (data: TopicTypes) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);
    }
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('domain', data.domain);
    mutationAdd.mutate(formData);
  };

    let defaultValues: TopicTypes = {
        code: '',
        name: '',
        description: '',
        imagePath: '',
        domain: domain
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

    const handleClose = () => {
        defaultValues = {
            code: '',
            name: '',
            description: '',
            imagePath: '',
            domain: domain
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
        <Typography variant='h6'>{t('Add Topic')}</Typography>
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
                  id='form-props-read-only-input-description'
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
