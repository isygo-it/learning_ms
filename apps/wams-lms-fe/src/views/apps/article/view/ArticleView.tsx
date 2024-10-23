import React, { MouseEvent, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import {FormHelperText, IconButton, InputLabel} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from 'react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import CommonFloatingButton from 'template-shared/@core/components/floatingButton/CommonFloatingButton';
import Icon from 'template-shared/@core/components/icon';
import Typography from '@mui/material/Typography';
import HeaderCardView from 'template-shared/@core/components/headerCardView';
import { ArticleTypes, ListItemsMenuType } from '../../../../types/apps/articleTypes';
import {
  downloadArticleFile,
  getArticleDetail,
  updateArticleById,
  updateArticleFileById,
} from './index';
import { AuthorTypes } from '../../../../types/apps/authorTypes';
import { fetchAllAuthors } from '../../author/view';
import { fetchAllTopics } from '../../topic/view';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { Checkbox, ListItemText } from '@mui/material';
import { Close } from '@mui/icons-material';
import { MuiChipsInput } from 'mui-chips-input';
import apiUrls from 'template-shared/configs/apiUrl';
import FileViewer from './FileViewer';

const ArticleView = ({ articleData }: { articleData: ArticleTypes }) => {
  const [originDetail, setOriginDetail] = useState<ArticleTypes>({ ...articleData });
  const [defaultValues, setDefaultValues] = useState<ArticleTypes>({
    id: originDetail.id,
    code: originDetail.code,
    domain: originDetail.domain,
    tags: originDetail.tags,
    authorID: originDetail.author.id,
    name: originDetail.name,
    title: originDetail.title,
    description: originDetail.description,
    extension: originDetail.extension,
    file: originDetail.file ?? new File([], ''),
    originalFileName: originDetail.originalFileName,
    topics: originDetail.topics ?? [],
    author: originDetail.author,
    type: originDetail.type,
  });

  const { t } = useTranslation();
  const actions = [
    { icon: <RefreshIcon />, name: 'Save', onClick: () => onSubmit(getValues()) },
    { icon: <RefreshIcon />, name: 'Reset', onClick: () => handleReset() },
  ];
  const { data: article } = useQuery(['article', originDetail.id], () => getArticleDetail(originDetail.id), {
    enabled: !!originDetail.id,
  });

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
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
    } else {
      setFileError(null);
      setSelectedFile(undefined);
    }
  };

  const { data: authorList = [], isLoading: isLoadingAuthor } = useQuery<AuthorTypes[]>('authors', fetchAllAuthors);
  const { data: topicList = [] } = useQuery('topics', fetchAllTopics);
  const schema = yup.object().shape({
    title: yup.string().required(),
    name: yup.string().required(),
    description: yup.string().max(500, 'Description must be at most 500 characters'),
    tags: yup.array().of(yup.string()).required(),
    authorID: yup.string().required(),
    topics: yup.array().of(yup.string()).required(),
    type: yup.string().required(),
  });

  const {
    reset,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ArticleTypes>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (article) {
      setOriginDetail(article);
    }
  }, [article]);

  const handleDeleteTopic = (id: number) => {
    const updatedTopics = defaultValues.topics.filter(topic => topic.id !== id);
    setDefaultValues(prev => ({ ...prev, topics: updatedTopics }));
    setValue('topics', updatedTopics);
  };

  const uploadArticleImage = useMutation<any, Error, any>({
    mutationFn: (data: any) => uploadArticleImage(data),
    onSuccess: res => {
      console.log(res);
    },
    onError: err => {
      console.log(err);
    },
  });

  const onSubmit = async (data: ArticleTypes) => {
    const indexedTopicIds = [];
    data.topics.forEach(topic => {
      indexedTopicIds.push(topic.id);
    });

    const jsonData = {
      code: data.code,
      domain: data.domain,
      name: data.name,
      title: data.title,
      description: data.description,
      originalFileName: originDetail.originalFileName,
      extension: originDetail.extension,
      topicIds: [...indexedTopicIds],
      authorID: data.authorID ? data.authorID : undefined,
      author: data.author
        ? {
          id: data.author.id,
          code: data.author.code,
          firstname: data.author.firstname,
          domain: data.author.domain,
          lastname: data.author.lastname,
          email: data.author.email,
          phone: data.author.phone,
          imagePath: data.author.imagePath,
        }
        : undefined,
      tags: data.tags,
      type: data.type,
    };

    try {
      await updateArticleById(data.id, jsonData);
      if (selectedFile) {
        await updateArticleFileById(data.id, selectedFile);
      }
      console.log('Article and file updated successfully');
    } catch (error) {
      console.error('Error updating article:', error.message);
    }
  };

  const handleReset = () => {
    reset({
      ...originDetail,
      authorID: originDetail.author.id,
      topics: originDetail.topics,
      originalFileName: originDetail.originalFileName,
    });
    setSelectedFile(undefined);
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSave = () => {
    onSubmit(getValues());
  };

  const listItems = [
    {
      title: 'Download',
      name: 'Template.Download',
    },
    {
      title: 'Share',
      name: 'Share',
    },
  ];

  const handleChange = (item?: ListItemsMenuType) => {
    const itemClick = listItems.find(d => d.name === item?.name);
    if (itemClick?.title === 'Download') {
      handleClose();
    }
    if (itemClick?.title === 'Share') {
      handleShare();
    }
  };
  const handleDownload = async () => {
    if (originDetail.originalFileName) {
      await downloadArticleFile(originDetail.originalFileName);
    }
  };

  const handleShare = () => {
    setAnchorEl(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HeaderCardView
        title={'Article'}
        btnSave={true}
        btnCancel={true}
        multiBtn={true}
        handleClick={handleClick}
        ITEM_HEIGHT={48}
        listItems={listItems}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleReset={handleReset}
        handleChange={handleChange}
        onSubmit={handleSave}
        disableCancel={false}
        disableSubmit={false}
      />

      <Card sx={{ p: 3, mb: 2, boxShadow: 2, borderRadius: 2 }}>
        <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
          {t('Article Info')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FormHelperText sx={{ mr: 2, color: 'text.secondary', fontWeight: 'bold' }}>
            Update Files
          </FormHelperText>
          <label htmlFor='file' style={{ cursor: 'pointer' }}>
            <input
              type='file'
              name='file'
              id='file'
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Icon
              icon='tabler:upload'
              style={{ fontSize: 24, color: selectedFile ? 'green' : 'gray' }}
            />
          </label>
          <FormHelperText sx={{ ml: 2, color: 'text.secondary', fontWeight: 'bold' }}>
            Download File
          </FormHelperText>
          <IconButton
            color="primary"
            onClick={handleDownload}
            disabled={!originDetail.originalFileName}
            sx={{ ml: 1 }}
          >
            <Icon icon="tabler:download" style={{ fontSize: 24 }} />
          </IconButton>
          {fileError && <FormHelperText sx={{ color: 'error.main', ml: 2 }}>{fileError}</FormHelperText>}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('code')}</InputLabel>
              <Controller
                name='code'
                control={control}
                render={({ field: { value } }) => (
                  <TextField
                    value={value}
                    variant='outlined'
                    disabled
                    label={t('Code')}
                    fullWidth
                  />
                )}
              />
            </FormControl>
          </Grid>


          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <Controller
                name='domain'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('domain')}
                    variant='outlined'
                    fullWidth
                    error={!!errors.domain}
                    helperText={errors.domain?.message}
                    disabled
                  />
                )}
              />
            </FormControl>
          </Grid>






          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{t('Add Topic')}</InputLabel>
              <Controller
                name="topics"
                control={control}
                render={({ field }) => (
                  <Select
                    multiple
                    {...field}
                    value={field.value.map((topic) => topic.id)}
                    onChange={(e) => {
                      const selectedIds = e.target.value as number[];
                      const selectedTopics = topicList.filter((topic) =>
                        selectedIds.includes(topic.id)
                      );
                      setDefaultValues((prev) => ({
                        ...prev,
                        topics: selectedTopics,
                      }));
                      field.onChange(selectedTopics);
                    }}
                    renderValue={() => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {field.value.map((topic) => (
                          <Chip
                            key={topic.id}
                            label={topic.name}
                            onDelete={() => handleDeleteTopic(topic.id)}
                            sx={{ margin: '4px' }}
                            deleteIcon={<Close fontSize="small" onMouseDown={(e) => e.stopPropagation()} />}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {topicList.map((topic) => (
                      <MenuItem key={topic.id} value={topic.id}>
                        <Checkbox checked={field.value.some((t) => t.id === topic.id)} />
                        <ListItemText primary={topic.name} />
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="author-id-label">{t('Author')}</InputLabel>
              <Controller
                name="authorID"
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <Select
                    labelId="author-id-label"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    displayEmpty
                    inputRef={ref}
                  >
                    {isLoadingAuthor ? (
                      <MenuItem value="" disabled>
                        {t('Loading authors...')}
                      </MenuItem>
                    ) : authorList.length > 0 ? (
                      authorList.map((author) => (
                        <MenuItem key={author.id} value={author.id}>
                          {author.firstname} {author.lastname}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        {t('No authors available')}
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
              <FormHelperText>{errors.authorID?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <Controller
                name="tags"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <MuiChipsInput
                    size="small"
                    value={Array.isArray(value) ? value : []}
                    onChange={(newTags) => onChange(newTags)}
                    label="Tags"
                    error={Boolean(errors.tags)}
                  />
                )}
              />
              {errors.tags && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.tags.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Name')}
                    variant='outlined'
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Title')}
                    variant='outlined'
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Description')}
                    variant='outlined'
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              File Viewer
            </Typography>
            <FileViewer
              fileUrl={`${apiUrls.apiUrl_LMS_LMSArticleFileDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(originDetail?.originalFileName)}&version=1`}
              fileExtension={originDetail.type}
            />
          </Grid>
        </Grid>
      </Card>
      <CommonFloatingButton actions={actions} />
    </form>
  );


};

export default ArticleView;
