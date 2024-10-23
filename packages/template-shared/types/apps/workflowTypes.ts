import {StateType} from './stateTypes'
import {TransitionType} from './transitionTypes'

export type WorkflowsType = {
    id: number
    domain: string
    code: string
    name: string
    category: string
    description: string
    type: string
    workflowStates: StateType[]
    workflowTransitions: TransitionType[]
}

export type WorkflowData = {
    domain: string
    name: string
    category: string
    description: string
    type: string
}

export type AvailableEmailsRequest = {
    domain: string
    wfCode: string
}
