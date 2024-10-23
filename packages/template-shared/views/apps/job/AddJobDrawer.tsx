import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'template-shared/@core/components/icon'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { JobOfferType } from 'template-shared/types/apps/jobOfferTypes'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addjob } from 'template-shared/@core/api/job'
import { fetchDomains } from 'template-shared/@core/api/domain'
import { fetchEmails } from 'template-shared/@core/api/emails'

import { fetchAlljobTemplates } from 'template-shared/@core/api/job-template'
import { fetchAllCustomer } from 'template-shared/@core/api/customer'
import toast from 'react-hot-toast'
import {checkPermission} from "../../../@core/api/decodedPermission";
import {PermissionAction, PermissionApplication, PermissionPage} from "../../../types/apps/authRequestTypes";

interface SidebarAddJobType {
  open: boolean
  toggle: () => void
  domain:string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  domain: yup.string().required(),
  title: yup.string().required(),
  owner: yup.string(),
  industry: yup.string().required(),
  customer: yup.string()
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
const SidebarAddJob = (props: SidebarAddJobType) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { open, toggle, domain } = props
  const [selectedDomain, setselectedDomain] = useState('')
  const [selectedTemplate, setselectedTemplate] = useState<any>()
  const { data: template } = useQuery(`jobTemplates`, () => fetchAlljobTemplates())
  const { data: domains } = useQuery(`domains`, () => fetchDomains())
  const { data: emails } = useQuery(['emails', selectedDomain], () => fetchEmails(selectedDomain), {
    enabled: !!selectedDomain
  })

  const { data: customers } = useQuery(`customers`, () => fetchAllCustomer())

  const handleChangeDomain = (event: any) => {
    setselectedDomain(event.target.value)
  }
  const handleChangeTemplate = (event: any) => {
    setselectedTemplate(event.target.value)
    if (event.target.value) {
      setselectedDomain(event.target.value.jobOffer.domain)
      reset(event.target.value.jobOffer)
    }
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<JobOfferType>({
    defaultValues: {
      title: '',
      owner: '',
      domain:domain,
      industry: '',
      customer: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: JobOfferType) => {
    data.id = null
    data.code = null
    const dataDetails = data.details
    const dataDetailFile = data.additionalFiles
    if (dataDetails) {
      data.details.id = null
      if (dataDetails.contractInfo) {
        data.details.contractInfo.id = null
      }
      if (dataDetails.jobInfo) {
        data.details.jobInfo.id = null
      }
      if (dataDetails.hardSkills) {
        data.details.hardSkills = data.details.hardSkills.map(item => ({ ...item, id: null }))
      }
      if (dataDetails.softSkills) {
        data.details.softSkills = data.details.softSkills.map(item => ({ ...item, id: null }))
      }
      if (dataDetailFile) {
        data.additionalFiles = []
      }
    }
    jobMutationAdd.mutate(data)
  }

  const jobMutationAdd = useMutation({
    mutationFn: (data: JobOfferType) => addjob(data),

    onSuccess: (res: JobOfferType) => {
      toast.success(t('Job.Job_added_successfully'))
      const cachedData = (queryClient.getQueryData('jobs') as any[]) || []
      const updatedData = [...cachedData]
      console.log(cachedData)
      console.log(updatedData)
      updatedData.push(res)
      queryClient.setQueryData('jobs', updatedData)
      handleClose()
    }
  })

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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{t('Action.Add')}</Typography>
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
            <InputLabel>{t('Domain.Domain')}</InputLabel>
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
                  defaultValue=''
                  onChange={e => {
                    onChange(e)
                    handleChangeDomain(e)
                  }}
                  value={value}
                >
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {domains?.map((domain, index) => (
                    <MenuItem key={index} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.domain && <FormHelperText sx={{ color: 'error.main' }}>{errors.domain.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>{'Template'}</InputLabel>
            <Select
              size='small'
              label={t('Template.Template')}
              name='jobTemplates'
              defaultValue=''
              value={selectedTemplate}
              onChange={e => {
                handleChangeTemplate(e)
              }}
            >
              <MenuItem value=''>
                <em>{t('None')}</em>
              </MenuItem>
              {template?.map((template, index) => (
                <MenuItem key={index} value={template}>
                  {template.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Title') as string}
                  onChange={onChange}
                  placeholder={t('Enter_job_title') as string}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>{t('Owner')}</InputLabel>
            <Controller
              name='owner'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  size='small'
                  label={t('Job.Owner')}
                  value={value}
                  MenuProps={MenuProps}
                  onChange={event => {
                    const selectedEmail = event.target.value
                    onChange(selectedEmail)
                  }}
                >
                  {selectedDomain &&
                    emails?.map((email, index) => (
                      <MenuItem key={index} value={email}>
                        {email}
                      </MenuItem>
                    ))}
                </Select>
              )}
            />
            {errors.owner && <FormHelperText sx={{ color: 'error.main' }}>{errors.owner.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>{t('Customer.Customer')}</InputLabel>
            <Controller
              name='customer'
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select size='small' label={t('Customer.Customer')} name='customer' onChange={onChange} value={value}>
                  <MenuItem value=''>
                    <em>{t('None')}</em>
                  </MenuItem>
                  {customers?.map(customer => (
                    <MenuItem key={customer.id} value={customer.name}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='industry'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  size='small'
                  value={value}
                  label={t('Job.Industry')}
                  onChange={onChange}
                  placeholder='industry'
                  error={Boolean(errors.industry)}
                />
              )}
            />
            {errors.industry && <FormHelperText sx={{ color: 'error.main' }}>{errors.industry.message}</FormHelperText>}
          </FormControl>
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
  )
}

export default SidebarAddJob
