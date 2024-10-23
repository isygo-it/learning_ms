import React, {SyntheticEvent, useState} from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import Card from '@mui/material/Card'
import {templateDetailsDataType, TemplateType} from '../../../../types/apps/templateTypes'
import * as yup from 'yup'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {getData, handleDownload, updateTemplate} from '../../../../api/template'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CommonFloatingButton from 'template-shared/@core/components/floatingButton/CommonFloatingButton'
import SaveIcon from '@mui/icons-material/Save'
import DownloadIcon from '@mui/icons-material/Download'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'
import {useMutation, useQuery} from 'react-query'

const QuillNoSSRWrapper = dynamic(() => import('react-quill'), {ssr: false})
const TemplateView = (templateDetailsData: templateDetailsDataType) => {
  const defaultValues: TemplateType = {
    id: templateDetailsData.templateDetailsData.id,
    domain: templateDetailsData.templateDetailsData.domain,
    code: templateDetailsData.templateDetailsData.code,
    name: templateDetailsData.templateDetailsData.name,
    description: templateDetailsData.templateDetailsData.description,
    file: templateDetailsData?.file as File,
    path: ''
  }

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string()
  })
  const {
    control,
    getValues,
    formState: {errors}
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const [templ, settempl] = useState<string>('1')

  const [templateContent, setTemplateContent] = useState('')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    settempl(newValue)
  }

  const {isLoading} = useQuery([`templateContent`, templateDetailsData.id], () => getData(templateDetailsData), {
    onSuccess: res => {
      setTemplateContent(res)
    }
  })

  const mutation = useMutation({
    mutationFn: (data: TemplateType) => updateTemplate(data),
    onSuccess: () => {
    }
  })

  const onSubmit = (data: TemplateType) => {
    const blob = new Blob([templateContent], {type: 'text/plain'}) as File
    const fileName = templateDetailsData.templateDetailsData.code + '.ftl'
    const fileWithExtension = new File([blob], fileName, {
      type: 'text/plain',
      lastModified: Date.now()
    })
    data.file = fileWithExtension
    mutation.mutate(data)
  }

  const downloadtemplate = (data: TemplateType) => {
    handleDownload(data)
  }

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{header: 1}, {header: 2}],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{script: 'sub'}, {script: 'super'}],
      [{indent: '-1'}, {indent: '+1'}],
      [{direction: 'rtl'}],
      [{size: ['small', false, 'large', 'huge']}],
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      [{color: []}, {background: []}],
      [{font: []}],
      [{align: []}],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }
  const {t} = useTranslation()
  const submitData = () => {
    onSubmit(getValues())
  }

  const downloadtemp = () => {
    downloadtemplate(getValues())
  }
  const actions = [
    {icon: <SaveIcon/>, name: 'Save', onClick: submitData},
    {icon: <DownloadIcon/>, name: 'Download', onClick: downloadtemp}
  ]

  // @ts-ignore
  return !isLoading ? (
    <div>
      <Card variant='outlined'>
        <CardHeader title={t('Template Details')}/>

        <CardContent>
          <Grid container spacing={8}>
            <Grid container item xs={12} sm={4} spacing={4}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='domain'
                    control={control}
                    rules={{required: true}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        size='small'
                        name='domain'
                        label={t('Domain.Domain')}
                        value={value}
                        onChange={onChange}
                        disabled
                        variant='outlined'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='code'
                    control={control}
                    rules={{required: true}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        size='small'
                        name='code'
                        label={t('Code')}
                        value={value}
                        onChange={onChange}
                        disabled
                        variant='outlined'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={control}
                    rules={{required: true}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        size='small'
                        name='name'
                        label={t('name')}
                        value={value}
                        onChange={onChange}
                        placeholder='Name'
                        error={Boolean(errors.name)}
                        variant='outlined'
                      />
                    )}
                  />
                  {errors.name && <FormHelperText sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container item xs={12} sm={8} spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name='description'
                    control={control}
                    rules={{required: true}}
                    render={({field: {value, onChange}}) => (
                      <TextField
                        size='small'
                        name='description'
                        label={t('Description')}
                        value={value || ''}
                        onChange={onChange}
                        multiline
                        rows={6}
                        placeholder='Description'
                        error={Boolean(errors.description)}
                        variant='outlined'
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{color: 'error.main'}}>{errors.description.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card style={{marginTop: '16px'}}>
        <CardHeader title={t('Template content')}/>
        <CardContent>
          {/* Quill editor */}
          <TabContext value={templ}>
            <TabList onChange={handleChange}>
              <Tab value='1' label={t('Text View')}/>
              <Tab value='2' label={t('Html View')}/>
            </TabList>
            <TabPanel value='1'>
              <Typography>
                <QuillNoSSRWrapper
                  theme='snow'
                  value={templateContent}
                  onChange={setTemplateContent}
                  modules={modules}
                  style={{marginBottom: '16px'}}
                />
              </Typography>
            </TabPanel>
            <TabPanel value='2'>
              <Typography>
                <TextField
                  size='small'
                  fullWidth
                  multiline
                  value={templateContent}
                  onChange={e => setTemplateContent(e?.target?.value)}
                />
              </Typography>
            </TabPanel>
          </TabContext>
          <CommonFloatingButton actions={actions}/>
        </CardContent>
      </Card>
    </div>
  ) : null
}

export default TemplateView
