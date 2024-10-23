// ** Next Import
// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Custom Components Imports
import React from 'react'
import IconButton from '@mui/material/IconButton'
import {CardHeader} from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {useTranslation} from 'react-i18next'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Divider from "@mui/material/Divider";
import Styles from "template-shared/style/style.module.css";
import {AuthorTypes} from "../../../../types/apps/authorTypes";

interface CardItem {
  data: AuthorTypes
  onDeleteClick: (rowId: number) => void
  onEditClick: (data: AuthorTypes) => void
  imageUrl: string
}

const AuthorCard = (props: CardItem) => {
  const {data, imageUrl, onDeleteClick, onEditClick} = props



  const {t} = useTranslation()

  return (
    <Card >
      <CardHeader
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 'initial',
          '& .MuiCardHeader-avatar': { mr: 2 }
        }}
        subheader={
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end'
            }}
          ></Box>
        }
        action={
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', padding: '.05rem' }}>
              { (
                <Tooltip title={t('Action.Delete')}>
                  <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => onDeleteClick(data.id)}>
                    <Icon icon='tabler:trash'/>
                  </IconButton>
                </Tooltip>
              )}
              { (
                <Tooltip title={t('Edit Author')}>
                  <IconButton size='small' sx={{color: 'text.secondary'}} onClick={() => onEditClick(data)}>
                    <Icon icon='tabler:edit'/>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </>
        }
      />
      <Divider className={Styles.dividerStyle} />
      <CardContent>
        <Box className={Styles.cardContentStyle}>
          <Avatar
            sx={{width: '81px', height: '81px'}}
            src={data.imagePath ? `${imageUrl}/${data.id}` : ''}
            alt={data.firstname }
          />

          <Typography className={Styles.cardTitle} variant='h6'>
            {' '}
            {data.firstname}{' '}
          </Typography>
          <Typography sx={{color: 'text.secondary'}}> {data.code} </Typography>


          <Accordion sx={{textAlign: 'left', boxShadow: 'none !important', width: '100%'}}>
            <AccordionSummary
              sx={{padding: '0px'}}
              id='panel-header-1'
              aria-controls='panel-content-1'
              expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down'/>}
            >
              <Typography>{t('Email')}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{padding: '0px'}}>
              {data.email && data.email.length > 0 ? (
                <Typography sx={{color: 'text.secondary'}}>{data.email}</Typography>
              ) : (
                <Typography sx={{color: 'text.secondary'}}>{t('No email')}</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
      <Divider className={Styles.dividerStyle} />
      <CardContent className={Styles.cardActionFooterStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AuthorCard
