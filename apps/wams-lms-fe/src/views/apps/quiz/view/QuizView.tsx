// ** MUI Imports
import React, {MouseEvent, useState} from 'react'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {Controller, useForm} from 'react-hook-form'
import * as yup from 'yup'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import {Accordion, AccordionDetails, AccordionSummary, FormHelperText} from '@mui/material'
import {useTranslation} from 'react-i18next'
import {QuizDetailType} from 'template-shared/types/apps/quizTypes'
import {yupResolver} from '@hookform/resolvers/yup'
import {useMutation} from 'react-query'
import {updateQuiz} from 'template-shared/@core/api/quiz'
import SectionQuiz from './SectionQuiz'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import CommonFloatingButton from 'template-shared/@core/components/floatingButton/CommonFloatingButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SidebarCard from './SidebarCard'
import Tooltip from '@mui/material/Tooltip'

const QuizView = ({quizData}) => {
    const [originDetail, setOriginDetail] = useState<QuizDetailType>({...quizData})
    const [defaultValues, setDefaultValues] = useState<QuizDetailType>({
        id: originDetail.id,
        code: originDetail.code,
        name: originDetail.name,
        description: originDetail.description,
        category: originDetail.category,
        sections: originDetail.sections
    })
    const {t} = useTranslation()
    const [sectionsCount, setSectionsCount] = useState<number>(defaultValues.sections?.length)

    const actions = [
        {icon: <SaveIcon/>, name: 'Save', onClick: () => onSubmit(getValues())},
        {icon: <RefreshIcon/>, name: 'Reset', onClick: () => handleReset()}
    ]

    const schema = yup.object().shape({
        name: yup.string().required(),
        category: yup.string().required(),
        description: yup.string(),
        sections: yup.array().of(
            yup.object().shape({
                description: yup.number(),
                name: yup.string().required(),
                order: yup.number().required(),
                questions: yup.array().of(
                    yup.object().shape({
                        question: yup.string().required(),
                        type: yup.string().required(),
                        order: yup.number().required(),
                        textAnswer: yup.string(),
                        options: yup.array().of(
                            yup.object().shape({
                                option: yup.string(),
                                check: yup.boolean()
                            })
                        )
                    })
                )
            })
        )
    })

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: {errors}
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const mutationEdit = useMutation({
        mutationFn: (data: QuizDetailType) => updateQuiz(data),
        onSuccess: res => {
            setOriginDetail(res)
            setDefaultValues(res)
            handleClose()
            console.log('new detail', originDetail)
        },
        onError: err => {
            console.log(err)
        }
    })
    const onSubmit = async (data: QuizDetailType) => {
        // console.log('data data', data)
        const updatedData = {
            ...data,
            sections: data.sections
        }

        console.log('data updatedData', updatedData)

        mutationEdit.mutate(data)
    }

    const handleReset = () => {
        reset()
    }
    const handlerAddSection = () => {
        setValue('sections', [
            ...getValues('sections'),
            {
                name: '',
                order: 0,
                description: '',
                questions: []
            }
        ])

        control._reset(getValues())

        setSectionsCount(sectionsCount + 1)
    }

    const handlerDeleteSection = (index: number) => {
        const newSection = getValues('sections').filter((e, i) => index != i)
        setValue('sections', newSection)
        setSectionsCount(count => Math.max(count - 1, 1))
        control._reset(getValues())
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [showSideBarCard, setShowSideBarCard] = useState<boolean>(false)

    const ITEM_HEIGHT = 48
    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleChangeShowSidebarCard = () => {
        setShowSideBarCard(!showSideBarCard)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <Grid container>
                <Grid item md={12}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader
                                title={t('Quiz.Quiz')}
                                action={
                                    <div>
                                        <Button variant='outlined' className={'button-padding-style'} sx={{mr: 2}}
                                                onClick={handleReset}>
                                            {t('Cancel')}
                                        </Button>
                                        <Button
                                            variant='contained'
                                            className={'button-padding-style'}
                                            onClick={() => onSubmit(getValues())}
                                        >
                                            {t('Save')}
                                        </Button>

                                        <IconButton aria-label='more' aria-controls='long-menu' aria-haspopup='true'
                                                    onClick={handleClick}>
                                            <Icon icon='tabler:dots-vertical'/>
                                        </IconButton>
                                        <Menu
                                            keepMounted
                                            id='long-menu'
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            open={Boolean(anchorEl)}
                                            PaperProps={{
                                                style: {
                                                    maxHeight: ITEM_HEIGHT * 4.5
                                                }
                                            }}
                                        >
                                            <MenuItem key={1} onClick={handleClose}>
                                                {t('Template.Download')}
                                            </MenuItem>
                                            <MenuItem key={2} onClick={handleClose}>
                                                {t('Quiz.Share')}
                                            </MenuItem>
                                        </Menu>
                                    </div>
                                }
                            />
                            <CardContent>
                                <Grid item container md={12}>
                                    {showSideBarCard ? (
                                        <Grid md={3} sx={{marginTop: '20px !important'}}>
                                            <SidebarCard
                                                handleChangeShowSidebarCard={handleChangeShowSidebarCard}
                                                defaultValues={defaultValues}
                                            />
                                        </Grid>
                                    ) : null}

                                    <Grid item md={showSideBarCard ? 9 : 12} sx={{display: 'flex'}}>
                                        {!showSideBarCard ? (
                                            <Grid className={'sidebarQuiz'}>
                                                <Card sx={{height: '266px'}}>
                                                    <CardHeader
                                                        title={
                                                            <Tooltip title={t('Quiz.Open_Sidebar')}>
                                                                <IconButton size='small'
                                                                            onClick={handleChangeShowSidebarCard}>
                                                                    <Icon icon='tabler:menu-2'/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Card>
                                            </Grid>
                                        ) : null}
                                        <Grid>
                                            <Accordion
                                                defaultExpanded
                                                className={'pl-4-rem'}
                                                sx={{
                                                    margin: '20px !important',
                                                    boxShadow:
                                                        '0px 3px 9px 1px rgb(51 48 60 / 21%), 0px 8px 9px 0px rgba(51, 48, 60, 0.02), 0px 1px 6px 4px rgba(51, 48, 60, 0.01) !important'
                                                }}
                                            >
                                                <AccordionSummary
                                                    id='panel-header-1'
                                                    aria-controls='panel-content-1'
                                                    expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down'/>}
                                                >
                                                    <Typography variant={'h6'}>
                                                        <strong>{t('Quiz.Quiz_info')}</strong>
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container item md={12} spacing={3} sx={{mt: 3}}>
                                                        <Grid item md={2} xs={12}>
                                                            <FormControl fullWidth sx={{mb: 4}}>
                                                                <Controller
                                                                    name='code'
                                                                    control={control}
                                                                    render={({field: {value}}) => (
                                                                        <TextField disabled size='small' value={value}
                                                                                   label={t('Code')}/>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={5} xs={12}>
                                                            <FormControl fullWidth sx={{mb: 4}}>
                                                                <Controller
                                                                    name='name'
                                                                    control={control}
                                                                    rules={{required: true}}
                                                                    render={({field: {value, onChange}}) => (
                                                                        <TextField
                                                                            size='small'
                                                                            value={value}
                                                                            label={t('Name')}
                                                                            onChange={onChange}
                                                                            error={Boolean(errors.name)}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.name && (
                                                                    <FormHelperText
                                                                        sx={{color: 'error.main'}}>{errors.name.message}</FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={5} xs={12}>
                                                            <FormControl fullWidth sx={{mb: 4}}>
                                                                <Controller
                                                                    name='category'
                                                                    control={control}
                                                                    rules={{required: true}}
                                                                    render={({field: {value, onChange}}) => (
                                                                        <TextField
                                                                            size='small'
                                                                            value={value}
                                                                            label={t('Category')}
                                                                            onChange={onChange}
                                                                            error={Boolean(errors.category)}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.category && (
                                                                    <FormHelperText sx={{color: 'error.main'}}>
                                                                        {errors.category.message}
                                                                    </FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item sm={12}>
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
                                                                            InputProps={{readOnly: false}}
                                                                            label={t('Description')}
                                                                            onChange={onChange}
                                                                            error={Boolean(errors.description)}
                                                                        />
                                                                    )}
                                                                />
                                                                {errors.description && (
                                                                    <FormHelperText sx={{color: 'error.main'}}>
                                                                        {errors.description.message}
                                                                    </FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                            <SectionQuiz
                                                control={control}
                                                errors={errors}
                                                toggleAdd={handlerAddSection}
                                                sectionsCount={sectionsCount}
                                                toggleDelete={handlerDeleteSection}
                                                getValues={getValues}
                                                setValue={setValue}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <CommonFloatingButton actions={actions}/>
                    </form>
                </Grid>
            </Grid>
        </>
    )
}
export default QuizView
