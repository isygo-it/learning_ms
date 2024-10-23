// ** React Imports
import {useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from '../../../../@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import {Controller, useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import apiUrls from '../../../../configs/apiUrl'
import {useTranslation} from 'react-i18next'
import localStorageKeys from '../../../../configs/localeStorage'

interface State {
    showNewPassword: boolean
    showCurrentPassword: boolean
    showConfirmNewPassword: boolean
}

const defaultValues = {
    newPassword: '',
    oldPassword: '',
    confirmNewPassword: ''
}

const schema = yup.object().shape({
    oldPassword: yup.string().min(8).required(),
    newPassword: yup
        .string()
        .min(8)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character'
        )
        .required(),
    confirmNewPassword: yup
        .string()
        .required()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const ChangePasswordCard = () => {
    // ** States
    const [values, setValues] = useState<State>({
        showNewPassword: false,
        showCurrentPassword: false,
        showConfirmNewPassword: false
    })

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues, resolver: yupResolver(schema)})

    const handleClickShowCurrentPassword = () => {
        setValues({...values, showCurrentPassword: !values.showCurrentPassword})
    }
    const handleClickShowNewPassword = () => {
        setValues({...values, showNewPassword: !values.showNewPassword})
    }

    const handleClickShowConfirmNewPassword = () => {
        setValues({...values, showConfirmNewPassword: !values.showConfirmNewPassword})
    }
    const {t} = useTranslation()
    const onPasswordFormSubmit = (data: any) => {
        changePassword(data)
            .then(() => {
                toast.success(t('Reset Password.Password_Changed_Successfully'))
            })
            .catch(() => {
                toast.error(t('Reset Password.Change_Password_Failed'))
            })
        reset(defaultValues)
    }

    async function changePassword(data: { newPassword: string; oldPassword: string }) {
        try {
            const storedToken = window.localStorage.getItem(localStorageKeys.accessToken)

            const response = await fetch(apiUrls.apiUrl_KMS_ChangePasswordEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + storedToken
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                toast.success(t('Reset Password.Password_Changed_Successfully'))
            }
        } catch (error) {
            toast.error(t('Reset Password.Change_Password_Failed'))
            throw error
        }
    }

    return (
        <Card>
            <CardHeader title={t('Reset Password.Change_Password')}/>
            <CardContent>
                <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='input-current-password' error={Boolean(errors.oldPassword)}>
                                    {t('Reset Password.Current_Password')}
                                </InputLabel>
                                <Controller
                                    name='oldPassword'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field: {value, onChange}}) => (
                                        <OutlinedInput
                                            value={value}
                                            label={t('Reset Password.Current_Password')}
                                            onChange={onChange}
                                            id='input-current-password'
                                            error={Boolean(errors.oldPassword)}
                                            type={values.showCurrentPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={handleClickShowCurrentPassword}
                                                    >
                                                        <Icon
                                                            icon={
                                                                values.showCurrentPassword
                                                                    ? 'fluent:slide-text-edit-24-regular'
                                                                    : 'fluent:slide-text-edit-24-regular-off'
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    )}
                                />
                                {errors.oldPassword && (
                                    <FormHelperText
                                        sx={{color: 'error.main'}}>{errors.oldPassword.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} sx={{mt: 0}}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='input-new-password' error={Boolean(errors.newPassword)}>
                                    {t('Reset Password.New Password')}
                                </InputLabel>
                                <Controller
                                    name='newPassword'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field: {value, onChange}}) => (
                                        <OutlinedInput
                                            value={value}
                                            label={t('Reset Password.New Password')}
                                            onChange={onChange}
                                            id='input-new-password'
                                            error={Boolean(errors.newPassword)}
                                            type={values.showNewPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onClick={handleClickShowNewPassword}
                                                        onMouseDown={e => e.preventDefault()}
                                                    >
                                                        <Icon
                                                            icon={
                                                                values.showNewPassword
                                                                    ? 'fluent:slide-text-edit-24-regular'
                                                                    : 'fluent:slide-text-edit-24-regular-off'
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    )}
                                />
                                {errors.newPassword && (
                                    <FormHelperText
                                        sx={{color: 'error.main'}}>{errors.newPassword.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='input-confirm-new-password'
                                            error={Boolean(errors.confirmNewPassword)}>
                                    {t('Security.Confirm_New_Password')}
                                </InputLabel>
                                <Controller
                                    name='confirmNewPassword'
                                    control={control}
                                    rules={{required: true}}
                                    render={({field: {value, onChange}}) => (
                                        <OutlinedInput
                                            value={value}
                                            label={t('Reset Password.Confirm New Password')}
                                            onChange={onChange}
                                            id='input-confirm-new-password'
                                            error={Boolean(errors.confirmNewPassword)}
                                            type={values.showConfirmNewPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={handleClickShowConfirmNewPassword}
                                                    >
                                                        <Icon
                                                            icon={
                                                                values.showConfirmNewPassword
                                                                    ? 'fluent:slide-text-edit-24-regular'
                                                                    : 'fluent:slide-text-edit-24-regular-off'
                                                            }
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    )}
                                />
                                {errors.confirmNewPassword && (
                                    <FormHelperText
                                        sx={{color: 'error.main'}}>{errors.confirmNewPassword.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={{fontWeight: 500}}>{t('Security.Password_Requirements')}:</Typography>
                            <Box component='ul' sx={{pl: 6, mb: 0, '& li': {mb: 1.5, color: 'text.secondary'}}}>
                                <li>{t('Reset Password.Requirement1')}</li>
                                <li>{t('Reset Password.Requirement2')}</li>
                                <li>{t('Reset Password.Requirement3')}</li>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='contained' type='submit' sx={{mr: 4}}>
                                {t('Reset Password.SaveChanges')}
                            </Button>
                            <Button type='reset' variant='outlined' color='secondary' onClick={() => reset()}>
                                {t('Reset Password.Reset')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

export default ChangePasswordCard
