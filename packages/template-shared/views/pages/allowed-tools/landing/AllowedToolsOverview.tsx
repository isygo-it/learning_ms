// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../../../hooks/useAuth'
import apiUrls from '../../../../configs/apiUrl'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from '../../../../@core/components/icon'
import { ChangeEvent, useState } from 'react'
import { ApplicationType } from '../../../../types/apps/applicationTypes'
import ListItem from '@mui/material/ListItem'

const AllowedToolsOverview = () => {
  const auth = useAuth()
  console.log('auth ', auth)
  const application = auth.user?.applications
  const { t } = useTranslation()

  const [query, setQuery] = useState<string>('')
  const [filteredTools, setFilteredTools] = useState<ApplicationType[]>([])

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (application !== null) {
      const searchFilterFunction = (appl: ApplicationType) =>
        appl.title.trim().toLowerCase().includes(e.target.value.toLowerCase())

      const filteredToolsArr = application?.filter(searchFilterFunction)

      setFilteredTools(filteredToolsArr)
    }
  }

  const renderArticles = () => {
    if (application && application.length) {
      const arrToMap = query.length && filteredTools.length ? filteredTools : application

      return (
        <>
          <TextField
            fullWidth
            size='small'
            value={query}
            onChange={handleFilter}
            placeholder='Search for tool...'
            sx={{ '& .MuiInputBase-root': { borderRadius: 2 }, margin: '21px 3px 15px 29px !important' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                  <Icon icon='tabler:search' fontSize={20} />
                </InputAdornment>
              )
            }}
          />

          {query.length > 0 && filteredTools.length <= 0 ? (
            <ListItem sx={{ marginLeft: 5 }}>
              <Typography sx={{ color: 'text.secondary' }}>{t('No_Applications_Found')}</Typography>
            </ListItem>
          ) : (
            arrToMap.map(app => {
              return (
                <Grid item xs={12} sm={6} md={3} key={app.code}>
                  <Tooltip title={app.description}>
                    <a
                      className={'default-link'}
                      href={
                        app.adminStatus === 'ENABLED'
                          ? `${app.url}?accessToken=${app.token.type}_${app.token.token}`
                          : undefined
                      }
                      target='_blank'
                      style={{ cursor: 'pointer' }}
                    >
                      <Box
                        className={'link-card'}
                        sx={{
                          backgroundColor:
                            app.adminStatus === 'ENABLED' ? 'inherit' : 'rgba(51, 48, 60, 0.04) !important'
                        }}
                      >
                        <Box sx={{ mb: 1.5, minHeight: 58, display: 'flex' }}>
                          <img
                            height='58'
                            src={
                              app.imagePath
                                ? `${apiUrls.apiUrl_IMS_ApplicationImageDownloadEndpoint}/${app.id}`
                                : '/images/favicon.png'
                            }
                            alt={app.title}
                          />
                        </Box>

                        <Typography variant='h6' sx={{ mb: 1.5 }}>
                          {app.title}
                        </Typography>
                      </Box>
                    </a>
                  </Tooltip>
                </Grid>
              )
            })
          )}
        </>
      )
    } else {
      return null
    }
  }

  return (
    <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
      {renderArticles()}
    </Grid>
  )
}

export default AllowedToolsOverview
