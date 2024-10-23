// ** MUI Imports
import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {QuestionType, QuizDetailType} from 'template-shared/types/apps/quizTypes'
import {useTranslation} from 'react-i18next'
import Repeater from 'template-shared/@core/components/repeater'
import {Control, Controller, UseFormGetValues, UseFormSetValue} from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import MCQ from './MCQ'
import MCQMA from './MCQMA'
import MCQM from './MCQM'
import MCQA from './MCQA'

interface QuestionQuizProps {
    questionCount: number
    control: Control<QuizDetailType>
    i: number

    getValues: UseFormGetValues<QuizDetailType>
    setValue: UseFormSetValue<QuizDetailType>
}

const QuestionsView = (props: QuestionQuizProps) => {
    const {control, questionCount, setValue, getValues, i} = props
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(null)
    const [count, setCount] = useState<number>(questionCount)
    const {t} = useTranslation()

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteDialogOpen(true)
        setIndex(index)
    }
    const handelDeleteQuestion = (j: number) => {
        const newQuestions = getValues(`sections.${i}.questions`).filter((e, d) => j != d)
        setValue(`sections.${i}.questions`, newQuestions)
        setCount(count - 1)
        control._reset(getValues())
    }

    const handleAddQuestion = () => {
        control._defaultValues.sections?.[i].questions.push({
            question: '',
            type: 'MCQ',
            order: 1,
            options: [],
            textAnswer: ''
        })

        setCount(count + 1)
    }

    const handleChangeType = (value: string, j: number) => {
        setValue(`sections.${i}.questions.${j}.type`, value)
        getValues().sections?.[i].questions?.[j].options.map(o => (o.checked = false))
        control._reset(getValues())
    }
    const getLink = (j: number) => {
        const id: number | string = control._defaultValues.sections?.[i].questions?.[j].id

        return `${id}`
    }

    return (
        <>
            <h3 style={{marginTop: 0, marginBottom: 0}}> {t('Quiz.Questions')} : </h3>

            <Grid>
                <Grid className='fullWidthRepeater'>
                    <Repeater count={count} key={`sections.${i}.id`}>
                        {(j: number) => {
                            return (
                                <Grid key={`sections.${i}.questions.${j}.id`} id={getLink(j)}>
                                    <div>
                                        <Grid container item md={12}>
                                            <Card
                                                sx={{
                                                    boxShadow: 'none !important',
                                                    padding: '0px '
                                                }}
                                            >
                                                <CardHeader
                                                    sx={{
                                                        paddingLeft: '0px !important',
                                                        paddingTop: '0px !important'
                                                    }}
                                                    title={
                                                        <h5 style={{marginTop: ' 12px', marginBottom: '10px'}}>
                                                            {t('Quiz.Question')}: {j + 1}
                                                        </h5>
                                                    }
                                                    action={
                                                        <Tooltip title={t('Quiz.Delete_Question') as string}>
                                                            <IconButton size='small'
                                                                        onClick={() => handleOpenDeleteDialog(j)}>
                                                                <Icon icon='tabler:trash' fontSize='1.25rem'/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                />

                                                <CardContent
                                                    sx={{
                                                        paddingLeft: '0px',
                                                        paddingBottom: '0px !important'
                                                    }}
                                                >
                                                    <Grid container item md={12} spacing={3}>
                                                        <Grid item md={12}>
                                                            <FormControl fullWidth>
                                                                <Controller
                                                                    name={`sections.${i}.questions.${j}.question`}
                                                                    control={control}
                                                                    rules={{required: true}}
                                                                    render={({field: {value, onChange}}) => (
                                                                        <TextField
                                                                            size='small'
                                                                            value={value}
                                                                            label={t('Quiz.Question_Name')}
                                                                            onChange={onChange}
                                                                        />
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <FormControl fullWidth>
                                                                <Controller
                                                                    name={`sections.${i}.questions.${j}.type`}
                                                                    control={control}
                                                                    rules={{required: true}}
                                                                    render={({field: {value}}) => (
                                                                        <Select
                                                                            name={`sections.${i}.questions.${j}.type`}
                                                                            size='small'
                                                                            value={value}
                                                                            label={t('Type')}
                                                                            labelId={`sections.${i}.questions.${j}.type`}
                                                                            onChange={e => {
                                                                                handleChangeType(e.target.value, j)
                                                                            }}
                                                                        >
                                                                            <MenuItem
                                                                                value={QuestionType.MCTAQ}>MCTAQ</MenuItem>
                                                                            <MenuItem
                                                                                value={QuestionType.TAQ}>TAQ</MenuItem>
                                                                            <MenuItem
                                                                                value={QuestionType.MCQ}>MCQ</MenuItem>
                                                                            <MenuItem
                                                                                value={QuestionType.MCQM}>MCQM</MenuItem>
                                                                            <MenuItem
                                                                                value={QuestionType.MCQA}>MCQA</MenuItem>
                                                                        </Select>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <FormControl fullWidth>
                                                                <Controller
                                                                    name={`sections.${i}.questions.${j}.order`}
                                                                    control={control}
                                                                    rules={{required: true}}
                                                                    render={({field: {value, onChange}}) => (
                                                                        <TextField size='small' value={value}
                                                                                   label={t('Order')}
                                                                                   onChange={onChange}/>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </Grid>

                                                        {control._defaultValues.sections?.[i].questions?.[j].type === QuestionType.MCQ ? (
                                                            <Grid container item md={12}>
                                                                <FormControl fullWidth>
                                                                    <Controller
                                                                        name={`sections.${i}.questions.${j}.options`}
                                                                        control={control}
                                                                        rules={{required: true}}
                                                                        render={({field: {value}}) => (
                                                                            <>
                                                                                <MCQ
                                                                                    countOptions={value?.length}
                                                                                    control={control}
                                                                                    indexSection={i}
                                                                                    indexQuestion={j}
                                                                                    getValues={getValues}
                                                                                    setValue={setValue}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        ) : null}

                                                        {control._defaultValues.sections?.[i].questions?.[j].type === QuestionType.TAQ ? (
                                                            <Grid container item md={12}>
                                                                <Grid item md={12}>
                                                                    <FormControl fullWidth>
                                                                        <Controller
                                                                            name={`sections.${i}.questions.${j}.textAnswer`}
                                                                            control={control}
                                                                            rules={{required: true}}
                                                                            render={({field: {value, onChange}}) => (
                                                                                <TextField
                                                                                    size='small'
                                                                                    value={value}
                                                                                    multiline
                                                                                    rows={3}
                                                                                    label={t('Quiz.Answer')}
                                                                                    onChange={onChange}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                        ) : null}

                                                        {control._defaultValues.sections?.[i].questions?.[j].type === QuestionType.MCTAQ ? (
                                                            <Grid container item md={12}>
                                                                <Grid item md={12}>
                                                                    <Grid container item md={12}>
                                                                        <FormControl fullWidth>
                                                                            <Controller
                                                                                name={`sections.${i}.questions.${j}.options`}
                                                                                control={control}
                                                                                rules={{required: true}}
                                                                                render={({field: {value}}) => (
                                                                                    <>
                                                                                        <MCQMA
                                                                                            countOptions={value?.length}
                                                                                            control={control}
                                                                                            indexSection={i}
                                                                                            indexQuestion={j}
                                                                                            getValues={getValues}
                                                                                            setValue={setValue}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        ) : null}
                                                        {control._defaultValues.sections?.[i].questions?.[j].type === QuestionType.MCQM ? (
                                                            <Grid container item md={12}>
                                                                <Grid item md={12}>
                                                                    <Grid container item md={12}>
                                                                        <FormControl fullWidth>
                                                                            <Controller
                                                                                name={`sections.${i}.questions.${j}.options`}
                                                                                control={control}
                                                                                rules={{required: true}}
                                                                                render={({field: {value}}) => (
                                                                                    <>
                                                                                        <MCQM
                                                                                            countOptions={value?.length}
                                                                                            control={control}
                                                                                            indexSection={i}
                                                                                            indexQuestion={j}
                                                                                            getValues={getValues}
                                                                                            setValue={setValue}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        ) : null}
                                                        {control._defaultValues.sections?.[i].questions?.[j].type === QuestionType.MCQA ? (
                                                            <Grid container item md={12}>
                                                                <Grid item md={12}>
                                                                    <Grid container item md={12}>
                                                                        <FormControl fullWidth>
                                                                            <Controller
                                                                                name={`sections.${i}.questions.${j}.options`}
                                                                                control={control}
                                                                                rules={{required: true}}
                                                                                render={({field: {value}}) => (
                                                                                    <>
                                                                                        <MCQA
                                                                                            countOptions={value?.length}
                                                                                            control={control}
                                                                                            indexSection={i}
                                                                                            indexQuestion={j}
                                                                                            getValues={getValues}
                                                                                            setValue={setValue}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                            />
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        ) : null}
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </div>
                                </Grid>
                            )
                        }}
                    </Repeater>
                    <Grid container item md={12} sx={{justifyContent: 'right', paddingBottom: '20px'}}>
                        <Button variant='contained' className={'button-padding-style'}
                                onClick={() => handleAddQuestion()}>
                            {t('Quiz.Add_Question')} <Icon icon='tabler:plus' style={{marginLeft: '10px'}}/>
                        </Button>
                    </Grid>
                </Grid>
                {deleteDialogOpen && (
                    <DeleteCommonDialog
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                        selectedRowId={index}
                        onDelete={handelDeleteQuestion}
                        item='Questions'
                    />
                )}
            </Grid>
        </>
    )
}
export default QuestionsView
