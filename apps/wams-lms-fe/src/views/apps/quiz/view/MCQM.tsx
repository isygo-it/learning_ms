// ** MUI Imports
import React, {useState} from 'react'
import Grid from '@mui/material/Grid'
import {Option, QuizDetailType} from 'template-shared/types/apps/quizTypes'
import {useTranslation} from 'react-i18next'
import {Control, Controller, UseFormGetValues, UseFormSetValue} from 'react-hook-form'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Repeater from 'template-shared/@core/components/repeater'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'

interface QuestionQuizProps {
    countOptions: number
    control: Control<QuizDetailType>
    indexSection: number
    indexQuestion: number
    getValues: UseFormGetValues<QuizDetailType>
    setValue: UseFormSetValue<QuizDetailType>
}

const MCQM = (props: QuestionQuizProps) => {
    const {control, countOptions, setValue, getValues, indexSection, indexQuestion} = props
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const [index, setIndex] = useState<number>(null)
    const {t} = useTranslation()

    const [count, setCount] = useState<number>(countOptions)

    const handleOpenDeleteDialog = (index: number) => {
        setDeleteDialogOpen(true)
        setIndex(index)
    }

    const handelDeleteOption = (indexOption: number) => {
        console.log('indexOption', indexOption)
        const options: Option[] = getValues().sections?.[indexSection].questions?.[indexQuestion].options?.filter(
            (e, i) => i !== indexOption
        ) as Option[]
        setValue(`sections.${indexSection}.questions.${indexQuestion}.options`, options)
        setCount(count - 1)
        control._reset(getValues())
    }
    const handleAddOptions = () => {
        const newOption: Option = {
            option: '',
            checked: false
        }
        getValues().sections?.[indexSection].questions?.[indexQuestion].options.push(newOption)
        setCount(count + 1)
        console.log('get value', getValues().sections?.[indexSection].questions?.[indexQuestion].options)
    }

    const handleChangeChek = (checked: boolean, ind: number) => {
        const newList = getValues()
        newList.sections?.[indexSection].questions?.[indexQuestion].options?.forEach((o, i) => {
            if (i === ind) {
                o.checked = checked
            }
        })

        setValue(
            `sections.${indexSection}.questions.${indexQuestion}.options`,
            newList.sections?.[indexSection].questions?.[indexQuestion].options as Option[]
        )
        control._reset(newList)
    }

    return (
        <>
            <Grid container>
                <Grid container item md={12} sx={{mt: 2}}>
                    <Repeater count={count} key={`sections.${indexSection}.questions.${indexQuestion}.id`}>
                        {(x: number) => {
                            return (
                                <div key={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.id`}>
                                    <Grid container spacing={3} sx={{mt: 3}}>
                                        <Grid item md={11}>
                                            <Grid container item md={12}>
                                                <Grid item md={10}>
                                                    <FormControl fullWidth>
                                                        <Controller
                                                            name={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.option`}
                                                            control={control}
                                                            rules={{required: true}}
                                                            render={({field: {value, onChange}}) => (
                                                                <TextField
                                                                    size='small'
                                                                    value={value}
                                                                    label={t('Quiz.Option_Name')}
                                                                    onChange={onChange}
                                                                />
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2}>
                                                    <FormControl fullWidth>
                                                        <Checkbox
                                                            checked={
                                                                control._defaultValues?.sections?.[indexSection].questions?.[indexQuestion]?.options[x]
                                                                    ?.checked
                                                            }
                                                            onChange={e => handleChangeChek(e.target.checked, x)}
                                                            name={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.option`}
                                                            value={`sections.${indexSection}.questions.${indexQuestion}.options.${x}.checked`}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={1}>
                                            <Grid item md={1} sx={{textAlign: 'right'}}>
                                                <Tooltip title={t('Quiz.Delete_Option') as string}>
                                                    <IconButton size='large' onClick={() => handleOpenDeleteDialog(x)}>
                                                        <Icon icon='tabler:trash'/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </div>
                            )
                        }}
                    </Repeater>
                    <Button
                        variant='outlined'
                        color='primary'
                        sx={{mb: 3, mt: 2}}
                        className={'button-padding-style'}
                        onClick={() => handleAddOptions()}
                    >
                        {t('Quiz.Add_Options')} <Icon icon='tabler:plus' style={{marginLeft: '10px'}}/>
                    </Button>
                </Grid>

                {deleteDialogOpen && (
                    <DeleteCommonDialog
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                        selectedRowId={index}
                        onDelete={handelDeleteOption}
                        item='Option'
                    />
                )}
            </Grid>
        </>
    )
}
export default MCQM
