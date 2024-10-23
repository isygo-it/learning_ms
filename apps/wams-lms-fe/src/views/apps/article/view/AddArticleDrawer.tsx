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
import Chip from '@mui/material/Chip';
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {Controller, useForm} from 'react-hook-form'

// ** Icon Imports


import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { InputLabel} from '@mui/material'

import Icon from "template-shared/@core/components/icon";
import {getDomainNames} from "template-shared/@core/api/domain";
import {DomainType} from "template-shared/types/apps/domainTypes";
import {PermissionAction, PermissionApplication, PermissionPage} from "template-shared/types/apps/authRequestTypes";
import {checkPermission} from "template-shared/@core/api/decodedPermission";
import {addNewArticle} from "./index";
import {ArticleTypeEnum, ArticleTypes} from "../../../../types/apps/articleTypes";
import {fetchAllAuthors} from "../../author/view";
import {AuthorTypes} from "../../../../types/apps/authorTypes";
import {MuiChipsInput} from "mui-chips-input";
import {fetchAllTopics} from "../../topic/view";

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({

  name: yup.string().required(),
  title: yup.string().required(),
  authorID: yup.string().required('Author ID is required'),
  topics: yup.array().of(yup.number()).required('Topics are required').min(1, 'At least one topic ID is required')

})

interface SidebarAddArticleType {
  open: boolean
  toggle: () => void
  domain: string
}

  const SidebarAddArticle = (props: SidebarAddArticleType) => {
  const queryClient = useQueryClient()
  const {open, toggle, domain} = props
  const [selectedFile,setSelectedFile] = useState<File | undefined>(undefined)
  const {t} = useTranslation()
  const {data: domainList, isLoading: isLoadingDomain} = useQuery('domains', getDomainNames)
  const {data: authorList, isLoading: isLoadingAuthor} = useQuery('authors', fetchAllAuthors)
  const { data: topicsList, isLoading: isLoadingTopics } = useQuery('topics', fetchAllTopics);

  const mutationAdd = useMutation({
    mutationFn: (data: FormData) => addNewArticle(data),
    onSuccess: (res: ArticleTypes) => {
      handleClose();
      const cachedData: ArticleTypes[] = queryClient.getQueryData('ArticleLists') || [];
      const updatedData = [...cachedData, res];
      queryClient.setQueryData('ArticleLists', updatedData);
    },
    onError: err => {
      console.log(err);
    }
  });

  const onSubmit = async (data: ArticleTypes) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('originalFileName', selectedFile.name);
    }

    formData.append('code', data.code);
    formData.append('domain', data.domain);
    formData.append('type', data.type);
    formData.append('authorID', data.authorID.toString());
    formData.append('name', data.name);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('extension', data.extension);
    formData.append('tags', data.tags);

    if (data.topics && data.topics.length > 0) {
      data.topics.forEach((topicId, index) => {
        formData.append(`topicIds[${index}]`, topicId.toString());
      });
    }

    mutationAdd.mutate(formData);
  };

    const [fileError, setFileError] = useState<string | null>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const selectedType = getValues('type');

    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (selectedType === 'PDF' && fileExtension !== 'pdf') {
        setFileError('Please upload a PDF file.');
        setSelectedFile(undefined);
      } else if (selectedType === 'VIDEO' && !['mp4', 'webm', 'ogg'].includes(fileExtension || '')) {
        setFileError('Please upload a video file (mp4, webm, or ogg).');
        setSelectedFile(undefined);
      } else if (selectedType === 'HTML' && fileExtension !== 'html') {
        setFileError('Please upload an HTML file.');
        setSelectedFile(undefined);
      } else {
        setFileError(null);
        setSelectedFile(file);
      }
    }
  };

  const defaultAuthor: AuthorTypes = {
    id: 0,
    code: '',
    firstname: '',
    domain: '',
    lastname: '',
    email: '',
    phone: '',
    imagePath: ''
  };

  let defaultValues: ArticleTypes = {
    tags: '',
    code: '',
    domain: domain || '',
    type:ArticleTypeEnum.HTML,
    authorID: 0,
    name: '',
    title: '',
    description: '',
    extension: '',
    file: undefined,
    originalFileName: '',
    topics: [],
    author: defaultAuthor
  };

    const {
        reset,
        control,
        handleSubmit,
        getValues,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const handleClose = () => {
      defaultValues = {
        tags: '',
        code: '',
        domain: domain || '',
        type:ArticleTypeEnum.HTML,
        authorID: 0,
        name: '',
        title: '',
        description: '',
        extension: '',
        file: undefined,
        originalFileName: '',
        topics: [],
        author: defaultAuthor
      };

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
        <Typography variant='h6'>{t('Add Article')}</Typography>
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


          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='select-topics-label'>Topics</InputLabel>
            <Controller
              name='topics'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  multiple
                  label="Topics"
                  id='select-topics'
                  value={value || []}
                  onChange={event => {
                    const selectedValues = event.target.value;
                    onChange(selectedValues);
                  }}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((id , index)=> (
                        <Chip key={index} label={topicsList.find(topic => topic.id === id)?.name || ''} />
                      ))}
                    </div>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 224,
                        width: 250,
                      },
                    },
                  }}
                  disabled={isLoadingTopics}
                >
                  {!isLoadingTopics && topicsList?.length > 0 ? (
                    topicsList.map(topic => (
                      <MenuItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No topics available</MenuItem>
                  )}
                </Select>
              )}
            />
            {errors.topics && <FormHelperText sx={{ color: 'error.main' }}>{errors.topics.message}</FormHelperText>}
          </FormControl>



          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="demo-simple-select-helper-label">{t('author')}</InputLabel>
            <Controller
              name="authorID"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size="small"
                  label={t('author')}
                  name="authorID"
                  defaultValue=""
                  onChange={(event) => onChange(Number(event.target.value))}
                  value={value ? value.toString() : ''}
                >
                  {!isLoadingAuthor && authorList?.length > 0
                    ? authorList?.map((author: AuthorTypes) => (
                      <MenuItem key={author.id} value={author.id.toString()}>
                        {author.lastname}
                      </MenuItem>
                    ))
                    : null}
                </Select>
              )}
            />
            {errors.authorID && <FormHelperText sx={{color: 'error.main'}}>{errors.authorID.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{mb: 4}}>
            <Controller
              name='tags'
              control={control}
              render={({field: {value, onChange}}) => (
                <MuiChipsInput
                  size='small'
                  value={Array.isArray(value) ? value : []}
                  onChange={newTags => onChange(newTags)}
                  label='Tags'
                  error={Boolean(errors.tags)}
                />
              )}
            />
            {errors.tags &&
              <FormHelperText sx={{color: 'error.main'}}>{errors.tags.message}</FormHelperText>}
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
                  label={t('name')}
                  onChange={onChange}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='select-article-type-label'>Type</InputLabel>
            <Controller
              name='type'
              control={control}
              rules={{ required: true }} // Ensure it's required
              render={({ field: { value, onChange } }) => (
                <Select
                  labelId='select-article-type-label'
                  value={value || 'HTML'} // Default value to 'HTML' if undefined
                  onChange={(e) => {
                    onChange(e.target.value); // Correctly update the type value
                    setSelectedFile(undefined); // Reset the file input on type change
                    setFileError(null); // Reset file error
                  }}
                  label="Type"
                >
                  <MenuItem value='HTML'>HTML</MenuItem>
                  <MenuItem value='PDF'>PDF</MenuItem>
                  <MenuItem value='VIDEO'>VIDEO</MenuItem>
                </Select>
              )}
            />
            {errors.type && <FormHelperText sx={{ color: 'error.main' }}>{errors.type.message}</FormHelperText>}
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
                  label={t('title')}
                  onChange={onChange}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && <FormHelperText sx={{color: 'error.main'}}>{errors.title.message}</FormHelperText>}
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
          <FormControl fullWidth sx={{ mb: 4 }}>
            <label htmlFor='file' style={{ alignItems: 'center', cursor: 'pointer' }}>
              <Button
                color='primary'
                variant='outlined'
                component='span'
                sx={{ width: '100%' }}
                startIcon={<Icon icon='tabler:upload' />}
                disabled={!getValues('type')}
              >
                {getValues('type') ? `Upload ${getValues('type')} File` : 'Select a Type First'}
              </Button>
              <input
                type='file'
                name='file'
                id='file'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <a>{selectedFile ? selectedFile.name : ''}</a>
            </label>
            {fileError && <FormHelperText sx={{ color: 'error.main' }}>{fileError}</FormHelperText>}
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

export default SidebarAddArticle
