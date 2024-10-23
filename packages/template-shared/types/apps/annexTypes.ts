export enum Language {
  AR = 'ar',
  FR = 'fr',
  EN = 'en',
  DE = 'de'
}

export type AnnexType = {
  id?: number
  tableCode?: string
  language?: Language
  value?: string
  description?: string
  reference?: string
  annexOrder?: number
}

export enum IEnumAnnex {
  FUNCTION_ROL = 'FUNROL',
  QUIZ_CATEGORY = 'QIZCAT',
  CURRENCY_AMOOUNT = 'CURRENCY',
  WEB_APPFE = 'WEAPFE',
  WEB_APPBE = 'WEAPBE',
  JOB_INDUSTRY = 'JOBIND',
  EMPLOYER_TYPE = 'EMPTYP',
  JOB_FUNCTION = 'JOBFUN',
   LANGUAGES_WEB="LWEB",
  LANGUAGES_STANDARD="LSTAND",
  LANGUAGES_WEBFE="LWEBFE",
  LANGUAGES_WEBBE="LWEBBE",
  EDUCATION_LEVEL = 'EDULEV',
  CONTRACT_ADVANTAGE='CTRADV',
  CONTRACT_EQUPMENT='CTREQUI',
  CONTRACT_AMENDMENT='CTRAMD',
}
