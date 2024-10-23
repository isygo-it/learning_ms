// ** React Imports
import {ReactNode} from 'react'


// ** Icon Imports
import LoginView from "template-shared/views/pages/login/LoginView";


// ** Layout Import
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'


// ** Styled Components


const LoginPage = () => {

  return <LoginView></LoginView>
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
