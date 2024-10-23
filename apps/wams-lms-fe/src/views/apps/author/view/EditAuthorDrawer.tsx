import {Avatar, Box, Button, FormControl, FormHelperText, IconButton, TextField, Typography} from '@mui/material'
import Drawer from '@mui/material/Drawer'
import {styled} from '@mui/material/styles'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation, useQueryClient} from 'react-query'
import {AuthorTypes} from "../../../../types/apps/authorTypes";
import {updateAuthorById} from "./index";
import apiUrls from "template-shared/configs/apiUrl";
import MuiPhoneNumber from "material-ui-phone-number";
import EmailInputMask from "template-shared/views/forms/form-elements/input-mask/EmailInputMask";

const Header = styled(Box)(({theme}) => ({
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

interface SidebarEditAuthorType {
  open: boolean
  dataAuthor: AuthorTypes | undefined
  toggle: () => void
 }

const SidebarEditAuthor = (props: SidebarEditAuthorType) => {
  console.log('props', props)
  const queryClient = useQueryClient()

  // ** Props
  const {open, toggle, dataAuthor} = props


  const defaultValues = {...dataAuthor}
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file)
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

  const {t} = useTranslation()

  const authorMutation = useMutation({
    mutationFn: (data: FormData) => updateAuthorById(data),
    onSuccess: (res: AuthorTypes) => {
      handleClose()
      const cachedAuthor: AuthorTypes[] = queryClient.getQueryData('AuthorLists') || []
      const index = cachedAuthor.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedAuthor = [...cachedAuthor]
        updatedAuthor[index] = res
        queryClient.setQueryData('AuthorLists', updatedAuthor)
      }
    }
  })

  const onSubmit = async (data: AuthorTypes) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);
    }
      formData.append('id', data.id.toString());
      formData.append('firstname', data.firstname);
      formData.append('lastname', data.lastname);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
    if (data.imagePath && selectedFile == undefined) {
      formData.append('imagePath', data.imagePath)
    }
    authorMutation.mutate(formData);
  };

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
        <Typography variant='h6'>{t('edit  Author')}</Typography>
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
              name='firstname'
              control={control}
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  InputProps={{readOnly: false}}
                  label={t('firstname')}
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
              render={({field: {value, onChange}}) => (
                <TextField
                  size='small'
                  value={value}
                  InputProps={{readOnly: false}}
                  label={t('lastname')}
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

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='phone'
              control={control}
              rules={{required: false}}
              render={({field: {value}}) => (
                <MuiPhoneNumber
                  variant="outlined"
                  fullWidth
                  size="small"
                  defaultCountry={"tn"}
                  countryCodeEditable={true}
                  label={t('Phone_Number')}
                  value={value}
                  onChange={(e) => {
                     {
                      const updatedValue = e.replace(/\s+/g, '')
                      setValue('phone', updatedValue)
                    }
                  }}
                />
              )}
            />
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

                    style={{display: 'none'}}
                    onChange={handleFileChange}
                  />
                  <Avatar
                    src={selectedFile ? URL.createObjectURL(selectedFile): `${apiUrls.apiUrl_LMS_LMSAuthorImageDownloadEndpoint}/${dataAuthor?.id}`}
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

export default SidebarEditAuthor
