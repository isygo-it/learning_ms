// ** MUI Imports
import React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useTranslation } from 'react-i18next'
import Icon from 'template-shared/@core/components/icon'
import { QuizDetailType } from 'template-shared/types/apps/quizTypes'
import CardContent from '@mui/material/CardContent'
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab'
import Box from '@mui/material/Box'

type SideBarProps = {
  handleChangeShowSidebarCard: () => void
  defaultValues: QuizDetailType
}

const SidebarCard = (props: SideBarProps) => {
  const { handleChangeShowSidebarCard, defaultValues } = props

  const { t } = useTranslation()

  return (
    <Card className={'show-sidebar'}>
      <CardHeader
        title={<Typography>{t('Quiz.Content')}</Typography>}
        action={
          <>
            <Tooltip title={t('Quiz.Close_Sidebar')}>
              <IconButton size='small' onClick={handleChangeShowSidebarCard}>
                <Icon icon='tabler:x' />
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <CardContent>
        {defaultValues ? (
          <>
            <Timeline className={'disable-before'}>
              {defaultValues.sections?.map(section => (
                <TimelineItem key={section.id}>
                  <TimelineSeparator>
                    <TimelineDot color='primary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 'bold' }} variant='subtitle1'>
                        <a className={'fast-link'} href={'#' + section.id}>
                          {section.name}
                        </a>
                      </Typography>
                    </Box>
                    <Timeline className={'disable-before style-child-timeline'}>
                      {section?.questions?.map(question => (
                        <TimelineItem key={question.id}>
                          <TimelineSeparator className={'style-separator'}>
                            <TimelineDot color='warning' variant='outlined' className={'style-separator-dot'} />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent className={'style-text-subtitle'}>
                            <Box
                              sx={{
                                mb: 2,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Typography sx={{ mr: 2 }} variant='subtitle2'>
                                <a className={'fast-link'} href={'#' + question.id}>
                                  {' '}
                                  {question.question}
                                </a>
                              </Typography>
                            </Box>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
export default SidebarCard
