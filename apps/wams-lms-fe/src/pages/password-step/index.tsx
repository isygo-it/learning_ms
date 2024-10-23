// ** React Imports
import {ReactNode} from 'react'
import BlankLayout from 'template-shared/@core/layouts/BlankLayout'
import PasswordStepView from "template-shared/views/pages/password-step/PasswordStepView";

const PasswordStep = () => {

  return (
    <PasswordStepView></PasswordStepView>
  )
}

PasswordStep.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

PasswordStep.guestGuard = true

export default PasswordStep
