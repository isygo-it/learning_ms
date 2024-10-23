import jwt from 'jsonwebtoken'
import localStorageKeys from '../../../configs/localeStorage'

interface AuthorityToken {
    aud: string
    domain: string
    exp: number
    'granted-authority': string[]
    iat: number
    iss: string
    'log-app': string
    sub: string
    'user-name': string
}

export const checkPermission = (application: string, page: string, action: string) => {
    const token = localStorage.getItem(localStorageKeys.authorityToken)
    const oldTokenDecoded = jwt.decode(token, {complete: true})
    const text = application + action + page
    const listCheck: AuthorityToken = oldTokenDecoded?.payload as AuthorityToken
    if (listCheck) {
        const index = listCheck['granted-authority']?.findIndex(d => d === text)
        if (index > -1) {
            return true
        } else {
            return false
        }
    }
}
