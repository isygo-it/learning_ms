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
import apiUrls from 'template-shared/configs/apiUrl'
import {updateTopicById} from "./index";
import {TopicTypes} from "../../../../types/apps/topicTypes";

const Header = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string()
})

interface SidebarEditTopicType {
  open: boolean
  dataTopic: TopicTypes | undefined
  toggle: () => void
  selectedFile: File | undefined
 }

const SidebarEditTopic = (props: SidebarEditTopicType) => {
  console.log('props', props)
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)

  // ** Props
  const {open, toggle, dataTopic} = props


  const defaultValues = {...dataTopic}

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

  const topicMutation = useMutation({
    mutationFn: (data: FormData) => updateTopicById(data),
    onSuccess: (res: TopicTypes) => {
      handleClose()
      const cachedTopic: TopicTypes[] = queryClient.getQueryData('TopicLists') || []
      const index = cachedTopic.findIndex(obj => obj.id === res.id)
      if (index !== -1) {
        const updatedTopic = [...cachedTopic]
        updatedTopic[index] = res
        queryClient.setQueryData('TopicLists', updatedTopic)
      }
    }
  })

  const onSubmit = async (data: TopicTypes) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFile.name);
    }
      formData.append('id', data.id.toString());
      formData.append('name', data.name);
      formData.append('domain', data.domain);
      formData.append('description', data.description);
    if (data.imagePath && selectedFile == undefined) {
      formData.append('imagePath', data.imagePath)
    }

     topicMutation.mutate(formData);
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
        <Typography variant='h6'>{t('edit topic')}</Typography>
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
                    src={selectedFile ? URL.createObjectURL(selectedFile): `${apiUrls.apiUrl_LMS_LMSTopicImageDownloadEndpoint}/${dataTopic?.id}`}
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

export default SidebarEditTopic
