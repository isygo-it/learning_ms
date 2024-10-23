// ** React Imports
import React, {ReactNode, useEffect} from 'react'

// ** Next Import
import {useRouter} from 'next/router'

// ** Types
// ** Config Import
// ** Context Imports
// ** Component Import
import NotAuthorized from '../../../pages/401'
import Spinner from '../spinner'
import BlankLayout from '../../layouts/BlankLayout'

// ** Hooks
// ** Util Import
import {ACLObj, AppAbility, buildAbilityFor} from "../../../configs/acl";
import {useAuth} from "../../../hooks/useAuth";
import {AbilityContext} from '../../../layouts/components/acl/Can'

interface AclGuardProps {
    children: ReactNode
    authGuard?: boolean
    guestGuard?: boolean
    aclAbilities: ACLObj
    homeRoute: string
}

const AclGuard = (props: AclGuardProps) => {
    // ** Props
    const {aclAbilities, children, guestGuard = false, authGuard = true, homeRoute} = props

    // ** Hooks
    const auth = useAuth()
    const router = useRouter()

    // ** Vars
    let ability: AppAbility

    useEffect(() => {
        if (auth.user && auth.user.role && !guestGuard && router.route === '/') {
            router.replace(homeRoute)
        }
    }, [auth.user, guestGuard, router])

    // User is logged in, build ability for the user based on his role
    if (auth.user && !ability) {
        ability = buildAbilityFor(auth.user.role, aclAbilities.subject)
        if (router.route === '/') {
            return <Spinner/>
        }
    }

    // If guest guard or no guard is true or any error page
    if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
        // If user is logged in and his ability is built
        if (auth.user && ability) {
            return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
        } else {
            // If user is not logged in (render pages like login, register etc..)
            return <>{children}</>
        }
    }

    // Check the access of current user and render pages
    if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
        if (router.route === '/') {
            return <Spinner/>
        }

        return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    }

    // Render Not Authorized component if the current user has limited access
    return (
        <BlankLayout>
            <NotAuthorized/>
        </BlankLayout>
    )
}

export default AclGuard
