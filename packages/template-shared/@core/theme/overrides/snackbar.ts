// ** Type Imports
import {OwnerStateThemeType} from './index'
import {Skin} from '../../../@core/layouts/types'

const Snackbar = (skin: Skin) => {
    return {
        MuiSnackbarContent: {
            styleOverrides: {
                root: ({theme}: OwnerStateThemeType) => ({
                    ...(skin === 'bordered' && {boxShadow: 'none'}),
                    backgroundColor: `rgb(51, 48, 60)`,
                    color: theme.palette.common[theme.palette.mode === 'light' ? 'white' : 'black']
                })
            }
        }
    }
}

export default Snackbar
