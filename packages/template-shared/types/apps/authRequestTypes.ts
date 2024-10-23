export type authRequestType = {
  domain: string
  userName: string
}

export enum PermissionApplication {
  SYSADMIN = 'identity-service.',
  PRM = 'recruitment-service.',
  KMS = 'key-service.',
  MMS = 'messaging-service.',
  SMS = 'storage-service.',
  HRM = 'human-resources-service.'
}

export enum PermissionPage {
  CUSTOMER = '.customer.',
  ACCOUNT = '.account.',
  ACCOUNT_IMAGE = '.accountimage.',
  ACCOUNT_DETAIL = '.accountdetails.',
  DOMAIN = '.domain.',
  APPLICATION = '.app.',
  ROLE_INFO = '.roleinfo.',
  APP_PARAMETER = '.appparameter.',
  ANNEX = '.annex.',
  PASSWORD_CONFIG = '.passwordconfig.',
  PEB_CONFIG = '.pebconfig.',
  DIGETS_CONFIG = '.digestconfig.',
  TOKEN_CONFIG = '.tokenconfig.',
  SENDER_CONFIG = '.senderconfig.',
  STORAGE_CONFIG = '.storageconfig.',
  TEMPLATE = '.template.',
  RESUME = '.resume.',
  RESUME_IMAGE= '.resumeimage.',
  JOB = '.joboffer.',
  WORKFLOW = '.workflow.',
  WORKFLOW_BOARD = '.workflowboard.',
  CONTRACT = '.contract.',
  CONTRACT_VACATION= '.vacation.',
  CONTRACT_FILE= '.contractfile.',
  CONTRACT_PAYMENT_SCHEDULE= '.paymentschedule.',
  EMPLOYEE = '.employee.',
  EMPLOYEE_IMAGE = '.employeeimage.',
  EMPLOYEE_CIN = '.cin.',
  EMPLOYEE_PASSPORT= '.passport.',
  EMPLOYEE_INSURANCE= '.insurancesecurity.',
}

export enum PermissionAction {
  DELETE = 'delete',
  READ = 'read',
  WRITE = 'write'
}
