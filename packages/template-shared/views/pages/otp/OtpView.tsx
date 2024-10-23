// ** React Imports
import React, { ChangeEvent, KeyboardEvent, ReactNode, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import Cleave from 'cleave.js/react'
import { Controller, useForm } from 'react-hook-form'

import themeConfig from 'template-shared/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'template-shared/views/pages/auth/AuthIllustrationV1Wrapper'

// ** Custom Styled Component
import CleaveWrapper from 'template-shared/@core/styles/libs/react-cleave'

// ** Util Import
import { hexToRGBA } from 'template-shared/@core/utils/hex-to-rgba'

// ** Styles
import 'cleave.js/dist/addons/cleave-phone.us'
import { LoginParams } from '../../../context/types'
import { useAuth } from '../../../hooks/useAuth'
import apiUrls from '../../../configs/apiUrl'
import localStorageKeys from '../../../configs/localeStorage'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 48,
  textAlign: 'center',
  height: '48px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const defaultValues: { [key: string]: string } = {
  val1: '',
  val2: '',
  val3: '',
  val4: ''
}

const OtpView = () => {
  // ** State
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<number[]>([])
  const auth = useAuth()

  const { t } = useTranslation()

  // ** Hooks
  const theme = useTheme()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (event: ChangeEvent, onChange: (...event: any[]) => void) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      const updatedOtpCode = [...otpCode]
      updatedOtpCode[index] = form[index].value
      setOtpCode(updatedOtpCode)
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }
  const onResendSubmit = async () => {
    const request: any = {
      domain: localStorage.getItem(localStorageKeys.domain),
      userName: localStorage.getItem(localStorageKeys.userName)
    }
    await fetch(`${apiUrls.apiUrl_IMS_AccountCheckAuthType}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(request)
    })
  }
  const router = useRouter()

  const returnToLogin = () => {
    router.replace('/login/')
  }

  const onSubmit = () => {
    console.log(defaultValues)
    const request: LoginParams = {
      domain: localStorage.getItem(localStorageKeys.domain) || '',
      application: process.env.NEXT_PUBLIC_APP_NAME || '',
      userName: localStorage.getItem(localStorageKeys.userName) || '',
      password: otpCode.join(''),
      authType: 'OTP',
      rememberMe: localStorage.getItem(localStorageKeys.rememberMe) == 'true'
    }
    console.log(request)
    auth.login(request, () => {})
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <div style={{ textAlign: 'center' }}>
              <img src='/images/apple-touch-icon.png' alt={'apple-touch-icon.png'} width={130} height={'100%'}></img>
            </div>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ ml: 2.5, fontWeight: 600, fontSize: '1.625rem', lineHeight: 1.385, mb: 1 }}>
                {t(`${themeConfig.templateName}`)}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                {t('Two-Step_Verification')} 💬
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>{t('send_otp_code_parag')}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
              {t('Type_your_4_digit_security_code')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CleaveWrapper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...(errorsArray.length && {
                    '& .invalid:focus': {
                      borderColor: theme => `${theme.palette.error.main} !important`,
                      boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                    }
                  })
                }}
              >
                {renderInputs()}
              </CleaveWrapper>
              {errorsArray.length ? (
                <FormHelperText sx={{ color: 'error.main' }}>{t('Please_enter_a_valid_OTP')}</FormHelperText>
              ) : null}
              <Button fullWidth type='submit' variant='contained' sx={{ mt: 2 }}>
                {t('Verify_My_Account')}
              </Button>
            </form>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>{t('Didnt_get_the_code')}</Typography>
              <Button onClick={onResendSubmit}>{t('Resend')}</Button>
            </Box>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button variant={'outlined'} onClick={returnToLogin}>
                {t('Return_Login')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

OtpView.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default OtpView
