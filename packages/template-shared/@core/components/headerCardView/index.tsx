// ** MUI Imports
import React from 'react'
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import {useTranslation} from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import Icon from '../icon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// interface  HraderCardViewType {
//     title : string,
//     btnSave : boolean,
//     btnCancel : boolean,
//     multiBtn : boolean,
//     listItems: string[]
//     handleClose: () => void
//     handleClick: () => void
//     anchorEl: null | HTMLElement
//     ITEM_HEIGHT : number
//     onSubmit: () => void
//     handleReset: () => void
// }

const HeaderCardView = ({
                            title,
                            btnSave,
                            btnCancel,
                            multiBtn,
                            listItems,
                            handleClose,
                            handleClick,
                            anchorEl,
                            ITEM_HEIGHT,
                            onSubmit,
                            handleReset,
                            handleChange,
                            disableSubmit,
                            disableCancel
                        }) => {
    const {t} = useTranslation()

    return (
        <Card sx={{marginBottom: '8px', position: 'sticky', top: '52px', zIndex: 1000, width: '100%'}}>
            <CardHeader
                sx={{padding: '0.5rem 1.5rem'}}
                title={t(title)}
                action={
                    <div>
                        {btnCancel && (
                            <Button
                                variant='outlined'
                                size={'small'}
                                className={'button-padding-style'}
                                sx={{mr: 2}}
                                onClick={handleReset}
                                disabled={disableCancel}
                            >
                                {t('Cancel')}
                            </Button>
                        )}
                        {btnSave && (
                            <Button
                                size={'small'}
                                disabled={disableSubmit}
                                variant='contained'
                                className={'button-padding-style'}
                                onClick={onSubmit}
                            >
                                {t('Save')}
                            </Button>
                        )}
                        {multiBtn && (
                            <>
                                <IconButton
                                    aria-label='more'
                                    aria-controls='long-menu'
                                    aria-haspopup='true'
                                    onClick={handleClick}
                                    size={'small'}
                                >
                                    <Icon icon='tabler:dots-vertical'/>
                                </IconButton>
                                <Menu
                                    sx={{transform: 'translate(-26px, 1px)'}}
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
                                    {listItems?.map((item, index) => (
                                        <MenuItem key={index} onClick={() => handleChange(item)}
                                                  sx={{fontSize: '0.8rem'}}>
                                            {t(item.name)}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </div>
                }
            />
        </Card>
    )
}
export default HeaderCardView
