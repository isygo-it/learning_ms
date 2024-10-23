// ** MUI Imports
import Box, {BoxProps} from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

const FallbackSpinner = ({sx}: { sx?: BoxProps['sx'] }) => {
    // ** Hook

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                ...sx
            }}
        >
            <img src='/images/apple-touch-icon.png' alt={'apple-touch-icon.png'} width={'200px'}></img>
            <CircularProgress disableShrink sx={{mt: 6}}/>
        </Box>
    )
}

export default FallbackSpinner
