// index.ts or index.tsx
import 'dotenv/config' // Import and load dotenv

let apiUrl_GATEWAY: string | undefined
let apiUrl_SMS: string | undefined
let apiUrl_IMS: string | undefined
let apiUrl_KMS: string | undefined
let apiUrl_MMS: string | undefined
let apiUrl_DMS: string | undefined
let apiUrl_RPM: string | undefined
let apiUrl_CMS: string | undefined
let apiUrl_HRM: string | undefined
let apiUrl_QUIZ: string | undefined
let apiUrl_SCUI: string | undefined
let apiUrl_LINK: string | undefined
let apiUrl_LMS: string | undefined

//let apiUrl_PMS: string | undefined
console.log('process.env.NEXT_PUBLIC_PROFILE ', process.env.NEXT_PUBLIC_PROFILE)
if (process.env.NEXT_PUBLIC_PROFILE === 'docker-dev') {
  apiUrl_GATEWAY = 'https://gateway.dev.prm.novobit.eu'
  apiUrl_SMS = 'https://sms.dev.prm.novobit.eu'
  apiUrl_IMS = 'https://ims.dev.prm.novobit.eu'
  apiUrl_KMS = 'https://kms.dev.prm.novobit.eu'
  apiUrl_MMS = 'https://mms.dev.prm.novobit.eu'
  apiUrl_DMS = 'https://dms.dev.prm.novobit.eu'
  apiUrl_RPM = 'https://rpm.dev.prm.novobit.eu'
  apiUrl_CMS = 'https://cms.dev.prm.novobit.eu'
  apiUrl_HRM = 'https://hrm.dev.prm.novobit.eu'
  apiUrl_QUIZ = 'https://quiz.dev.prm.novobit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.novobit.eu'
  apiUrl_LINK = 'https://lnk.dev.prm.novobit.eu'
  apiUrl_LMS = 'https://lms.dev.prm.novobit.eu'

  //apiUrl_PMS = 'https://pms.dev.prm.novobit.eu'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-prod') {
  apiUrl_GATEWAY = 'https://gateway.prm.novobit.eu'
  apiUrl_SMS = 'https://sms.prm.novobit.eu'
  apiUrl_IMS = 'https://ims.prm.novobit.eu'
  apiUrl_KMS = 'https://kms.prm.novobit.eu'
  apiUrl_MMS = 'https://mms.prm.novobit.eu'
  apiUrl_DMS = 'https://dms.prm.novobit.eu'
  apiUrl_RPM = 'https://rpm.prm.novobit.eu'
  apiUrl_CMS = 'https://cms.prm.novobit.eu'
  apiUrl_HRM = 'https://hrm.prm.novobit.eu'
  apiUrl_QUIZ = 'https://quiz.prm.novobit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.novobit.eu'
  apiUrl_LINK = 'https://link.prm.novobit.eu'
  apiUrl_LMS = 'https://lms.prm.novobit.eu'

  //apiUrl_PMS = 'https://pms.prm.novobit.eu'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'docker-qa') {
  apiUrl_GATEWAY = 'https://gateway.qa.prm.novobit.eu'
  apiUrl_SMS = 'https://sms.qa.prm.novobit.eu'
  apiUrl_IMS = 'https://ims.qa.prm.novobit.eu'
  apiUrl_KMS = 'https://kms.qa.prm.novobit.eu'
  apiUrl_MMS = 'https://mms.qa.prm.novobit.eu'
  apiUrl_DMS = 'https://dms.qa.prm.novobit.eu'
  apiUrl_RPM = 'https://rpm.qa.prm.novobit.eu'
  apiUrl_CMS = 'https://cms.qa.prm.novobit.eu'
  apiUrl_HRM = 'https://hrm.qa.prm.novobit.eu'
  apiUrl_QUIZ = 'https://quiz.qa.prm.novobit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.novobit.eu'
  apiUrl_LINK = 'https://link.qa.prm.novobit.eu'
  apiUrl_LMS = 'https://lms.qa.prm.novobit.eu'

  //apiUrl_PMS = 'https://pms.qa.prm.novobit.eu'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'development') {
  apiUrl_GATEWAY = 'https://gateway.dev.prm.novobit.eu'
  apiUrl_SMS = 'https://sms.dev.prm.novobit.eu'
  apiUrl_IMS = 'https://ims.dev.prm.novobit.eu'
  apiUrl_KMS = 'https://kms.dev.prm.novobit.eu'
  apiUrl_MMS = 'https://mms.dev.prm.novobit.eu'
  apiUrl_DMS = 'https://dms.dev.prm.novobit.eu'
  apiUrl_RPM = 'https://rpm.dev.prm.novobit.eu'
  apiUrl_CMS = 'https://cms.dev.prm.novobit.eu'
  apiUrl_HRM = 'https://hrm.dev.prm.novobit.eu'
  apiUrl_QUIZ = 'https://quiz.dev.prm.novobit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.novobit.eu'
  apiUrl_LINK = 'https://lnk.dev.prm.novobit.eu'
  apiUrl_LMS = 'https://lms.dev.prm.novobit.eu'

  //apiUrl_PMS = 'https://pms.dev.prm.novobit.eu'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-local') {
  apiUrl_GATEWAY = 'http://127.0.0.1:8060'
  apiUrl_SMS = 'http://127.0.0.1:55400'
  apiUrl_IMS = 'http://127.0.0.1:55402'
  apiUrl_KMS = 'http://127.0.0.1:55403'
  apiUrl_MMS = 'http://127.0.0.1:55404'
  apiUrl_DMS = 'http://127.0.0.1:55405'
  apiUrl_RPM = 'http://127.0.0.1:55409'
  apiUrl_CMS = 'http://127.0.0.1:55407'
  apiUrl_HRM = 'http://127.0.0.1:55408'
  apiUrl_QUIZ = 'http://127.0.0.1:55412'
  apiUrl_SCUI = 'https://ai.smartcode.novobit.eu'
  apiUrl_LINK = 'http://127.0.0.1:55413'
  apiUrl_LMS = 'http://127.0.0.1:55410'

  //apiUrl_PMS = 'http://127.0.0.1:55411'
} else if (process.env.NEXT_PUBLIC_PROFILE === 'dev-be-local') {
  apiUrl_GATEWAY = 'https://gateway.dev.prm.novobit.eu'
  apiUrl_SMS = 'https://sms.dev.prm.novobit.eu'
  apiUrl_IMS = 'https://ims.dev.prm.novobit.eu'
  apiUrl_KMS = 'https://kms.dev.prm.novobit.eu'
  apiUrl_MMS = 'https://mms.dev.prm.novobit.eu'
  apiUrl_DMS = 'https://dms.dev.prm.novobit.eu'
  apiUrl_RPM = 'https://rpm.dev.prm.novobit.eu'
  apiUrl_CMS = 'https://cms.dev.prm.novobit.eu'
  apiUrl_HRM = 'https://hrm.dev.prm.novobit.eu'
  apiUrl_QUIZ = 'https://quiz.dev.prm.novobit.eu'
  apiUrl_SCUI = 'http://127.0.0.1:5000'
  apiUrl_SCUI = 'http://127.0.0.1:5000'
  apiUrl_LINK = 'https://lnk.dev.prm.novobit.eu'
  apiUrl_LMS = 'http://127.0.0.1:55410'

  //apiUrl_PMS = 'http://127.0.0.1:55411'
} else {
  apiUrl_GATEWAY = 'https://gateway.dev.prm.novobit.eu'
  apiUrl_SMS = 'https://sms.dev.prm.novobit.eu'
  apiUrl_IMS = 'https://ims.dev.prm.novobit.eu'
  apiUrl_KMS = 'https://kms.dev.prm.novobit.eu'
  apiUrl_MMS = 'https://mms.dev.prm.novobit.eu'
  apiUrl_DMS = 'https://dms.dev.prm.novobit.eu'
  apiUrl_RPM = 'https://rpm.dev.prm.novobit.eu'
  apiUrl_CMS = 'https://cms.dev.prm.novobit.eu'
  apiUrl_HRM = 'https://hrm.dev.prm.novobit.eu'
  apiUrl_QUIZ = 'https://quiz.dev.prm.novobit.eu'
  apiUrl_SCUI = 'https://ai.smartcode.novobit.eu'
  apiUrl_LINK = 'https://lnk.dev.prm.novobit.eu'
  apiUrl_LMS = 'https://lms.dev.prm.novobit.eu'

  //apiUrl_PMS = 'https://pms.dev.prm.novobit.eu'
}

const apiUrls = {
  apiUrl_GATEWAY,

  //===========================================================================
  apiUrl_SMS,
  apiUrl_SMS_StorageConfigEndpoint: apiUrl_SMS + '/api/private/storage/config',

  //===========================================================================
  apiUrl_IMS,
  apiUrl_IMS_AccountEndpoint: apiUrl_IMS + '/api/private/account',
  apiUrl_IMS_MyAccountEndpoint: apiUrl_IMS + '/api/private/account/me',
  apiUrl_IMS_MyAccountFullDataEndpoint: apiUrl_IMS + '/api/private/account/profile',
  apiUrl_IMS_RestPasswordViaTokenEndpoint: apiUrl_IMS + '/api/private/account/password/reset/token',
  apiUrl_IMS_UpdateAccountLanguageEndpoint: apiUrl_IMS + '/api/private/account/updateLanguage',
  apiUrl_IMS_EditAccountUserEndpoint: apiUrl_IMS + '/api/private/account/update-account',
  apiUrl_IMS_AccountImageEndpoint: apiUrl_IMS + '/api/private/account/image',
  apiUrl_IMS_AccountImageDownloadEndpoint: apiUrl_IMS + '/api/private/account/image/download',
  apiUrl_IMS_AccountImageUploadEndpoint: apiUrl_IMS + '/api/private/account/image/upload',
  apiUrl_IMS_AccountUpdateStatusEndpoint: apiUrl_IMS + '/api/private/account/updateStatusAccount',
  apiUrl_IMS_AccountUpdateIsAdminEndpoint: apiUrl_IMS + '/api/private/account/updateIsAdmin',
  apiUrl_IMS_AccountDetailsEndpoint: apiUrl_IMS + '/api/private/accountDetails',
  apiUrl_IMS_AccountEmailsEndpoint: apiUrl_IMS + '/api/private/account/emails',
  apiUrl_IMS_AccountInfoEndpoint: apiUrl_IMS + '/api/private/account/accounts-info',
  apiUrl_IMS_ApplicationEndpoint: apiUrl_IMS + '/api/private/application',
  apiUrl_IMS_ApplicationUpdateStatusEndpoint: apiUrl_IMS + '/api/private/application/update-status',
  apiUrl_IMS_ApplicationImageEndpoint: apiUrl_IMS + '/api/private/application/image',
  apiUrl_IMS_ApplicationImageDownloadEndpoint: apiUrl_IMS + '/api/private/application/image/download',
  apiUrl_IMS_ApplicationImageUploadEndpoint: apiUrl_IMS + '/api/private/application/image/upload',
  apiUrl_IMS_CustomerEndpoint: apiUrl_IMS + '/api/private/customer',
  apiUrl_IMS_CustomerImageEndpoint: apiUrl_IMS + '/api/private/customer/image',
  apiUrl_IMS_CustomerImageDownloadEndpoint: apiUrl_IMS + '/api/private/customer/image/download',
  apiUrl_IMS_CustomerImageUploadEndpoint: apiUrl_IMS + '/api/private/customer/image/upload',
  apiUrl_IMS_CustomerUpdateStatusEndpoint: apiUrl_IMS + '/api/private/customer/update-status',
  apiUrl_IMS_DomainEndpoint: apiUrl_IMS + '/api/private/domain',
  apiUrl_IMS_DomainUpdateStatusEndpoint: apiUrl_IMS + '/api/private/domain/update-status',
  apiUrl_IMS_RoleInfoEndpoint: apiUrl_IMS + '/api/private/roleInfo',
  apiUrl_IMS_DomainImageEndpoint: apiUrl_IMS + '/api/private/domain/image',
  apiUrl_IMS_DomainImageDownloadEndpoint: apiUrl_IMS + '/api/private/domain/image/download',
  apiUrl_IMS_DomainImageUploadEndpoint: apiUrl_IMS + '/api/private/domain/image/upload',
  apiUrl_IMS_DomainNamesEndpoint: apiUrl_IMS + '/api/private/domain/names',
  apiUrl_IMS_AppParameterEndpoint: apiUrl_IMS + '/api/private/appParameter',
  apiUrl_IMS_ThemeEndpoint: apiUrl_IMS + '/api/private/theme',
  apiUrl_IMS_AnnexEndpoint: apiUrl_IMS + '/api/private/annex',
  apiUrl_IMS_PublicUserEndpoint: apiUrl_IMS + '/api/public/user',
  apiUrl_IMS_PasswordForgottenEndpoint: apiUrl_IMS + '/api/public/user/password/forgotten',
  apiUrl_IMS_LoginEndpoint: apiUrl_IMS + '/api/public/user/authenticate',
  apiUrl_IMS_AccountCheckAuthType: apiUrl_IMS + '/api/public/user/checkAuthType',
  apiUrl_IMS_AccountUpdateAuthTypeEndpoint: apiUrl_IMS + '/api/public/user/updateAuthType',
  apiUrl_IMS_RegisterEndpoint: apiUrl_IMS + '/jwt/register',
  apiUrl_IMS_AccountsByDomainEndpoint: apiUrl_IMS + '/api/private/account/domain',
  apiUrl_IMS_AccountsStatusByDomainEndpoint: apiUrl_IMS + '/api/private/account/chat/domain',
  apiUrl_IMS_ResendEmailCreationEndpoint: apiUrl_IMS + '/api/private/account/resend/email/creation',
  apiUrl_IMS_AccountStatistics: apiUrl_IMS + '/api/private/account/stat',
  apiUrl_IMS_AccountAdminDomainEndpoint: apiUrl_IMS + '/api/private/account/admin',

  //===========================================================================
  apiUrl_QUIZ,
  apiUrl_QUIZ_QuizEndpoint: apiUrl_LMS + '/api/private/quiz',
  apiUrl_QUIZ_QuizCandidateEndPoint: apiUrl_LMS + '/api/private/candidate/quiz',
  apiUrl_QUIZ_QuizCandidateAnswerEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/answer/submit',
  apiUrl_QUIZ_QuizCandidateReportEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/report',
  apiUrl_QUIZ_QuizCandidateCopyEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/copy',
  apiUrl_QUIZ_StartQuizCandidateEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/start',
  apiUrl_QUIZ_StartQuizCandidateAnswerEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/answer/start',
  apiUrl_QUIZ_SubmitQuizCandidateEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/submit',
  apiUrl_QUIZ_CompleteQuizCandidateEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/complete',
  apiUrl_QUIZ_QuizByCandidateAndTagsEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/tags',
  apiUrl_QUIZ_QuestionImageUploadEndPoint: apiUrl_LMS + '/api/private/quiz/question/image/upload',
  apiUrl_QUIZ_QuestionImageDownloadEndpoint: apiUrl_LMS + '/api/private/quiz/question/image/download',
  apiUrl_QUIZ_QuizByCategoryEndPoint: apiUrl_LMS + '/api/private/quiz/category',
  apiUrl_QUIZ_QuizDetailsByCodeEndpoint: apiUrl_LMS + '/api/private/quiz/code',
  apiUrl_QUIZ_QuizCandidateAnswerListEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/answer/list/submit',
  apiUrl_QUIZ_CompleteQuizAnswerCleanEndPoint: apiUrl_LMS + '/api/private/candidate/quiz/complete/clean',

  //===========================================================================

  apiUrl_LMS,
  apiUrl_LMS_LMSArticleEndpoint: apiUrl_LMS + '/api/private/article',
  apiUrl_LMS_LMSArticleVisitUserEndpoint: apiUrl_LMS + '/api/private/article/visit',
  apiUrl_LMS_LMSArticleWithFileEndpoint: apiUrl_LMS + '/api/private/article/file/upload',
  apiUrl_LMS_LMSArticleFileDownloadEndpoint: apiUrl_LMS + '/api/private/article/file/download',
  apiUrl_LMS_LMSTopicEndpoint: apiUrl_LMS + '/api/private/topic',
  apiUrl_LMS_LMSAuthorEndpoint: apiUrl_LMS + '/api/private/author',
  apiUrl_LMS_LMSAuthorImageDownloadEndpoint: apiUrl_LMS + '/api/private/author/image/download',
  apiUrl_LMS_LMSAuthorWithImageEndpoint: apiUrl_LMS + '/api/private/author/image',
  apiUrl_LMS_LMSTopicWithImageEndpoint: apiUrl_LMS + '/api/private/topic/image',
  apiUrl_LMS_LMSTopicTop6Endpoint: apiUrl_LMS + '/api/private/topic/top6',
  apiUrl_LMS_LMSTopicImageDownloadEndpoint: apiUrl_LMS + '/api/private/topic/image/download',

  //===========================================================================
  apiUrl_KMS,
  apiUrl_KMS_ConfigDigestEndpoint: apiUrl_KMS + '/api/private/config/digest',
  apiUrl_KMS_ConfigPasswordEndpoint: apiUrl_KMS + '/api/private/config/password',
  apiUrl_KMS_ConfigPebEndpoint: apiUrl_KMS + '/api/private/config/peb',
  apiUrl_KMS_ConfigTokenEndpoint: apiUrl_KMS + '/api/private/config/token',
  apiUrl_KMS_ChangePasswordEndpoint: apiUrl_KMS + '/api/private/password/change-password',

  //===========================================================================
  apiUrl_MMS,
  apiUrl_MMS_MailTemplateEndpoint: apiUrl_MMS + '/api/private/mail/template',
  apiUrl_MMS_MailTemplateFileDownloadEndpoint: apiUrl_MMS + '/api/private/mail/template/file/download',
  apiUrl_MMS_MailTemplateFileUploadEndpoint: apiUrl_MMS + '/api/private/mail/template/file/upload',
  apiUrl_MMS_MailTemplateUpdateByDomainEndpoint: apiUrl_MMS + '/api/private/mail/template/update',
  apiUrl_MMS_MailTemplateDelByDomainEndpoint: apiUrl_MMS + '/api/private/mail/template/delete/domain',
  apiUrl_MMS_MailSenderConfigEndpoint: apiUrl_MMS + '/api/private/config/mail',
  apiUrl_MMS_ChatFromEndpoint: apiUrl_MMS + '/api/private/chat/from',
  apiUrl_MMS_ChatAccountEndpoint: apiUrl_MMS + '/api/private/chat/account',
  apiUrl_MMS_ChatSendWithWebSocketEndpoint: apiUrl_MMS + '/api/private/ws/user/send',
  apiUrl_MMS_SocketChatEndpoint: apiUrl_MMS + '/socket/chat',

  //===========================================================================
  apiUrl_DMS,

  //===========================================================================
  apiUrl_RPM,
  apiUrl_RPM_ResumeEndpoint: apiUrl_RPM + '/api/private/resume',
  apiUrl_RPM_ResumeFileDownloadEndpoint: apiUrl_RPM + '/api/private/resume/file/download',
  apiUrl_RPM_ResumeFileUploadEndpoint: apiUrl_RPM + '/api/private/resume/file/upload',
  apiUrl_RPM_ResumeShareInfoEndpoint: apiUrl_RPM + '/api/private/resume/share',
  apiUrl_RPM_Resume_Upload_MultiFileEndpoint: apiUrl_RPM + '/api/private/resume/upload/multi-files',
  apiUrl_RPM_Resume_Delete_MultiFileEndpoint: apiUrl_RPM + '/api/private/resume/multi-file',
  apiUrl_RPM_Resume_Review_UpdateEndpoint: apiUrl_RPM + '/api/private/resume/resume-review/update',
  apiUrl_RPM_ResumeImageEndpoint: apiUrl_RPM + '/api/private/resume/image',
  apiUrl_RPM_ResumeImageDownloadEndpoint: apiUrl_RPM + '/api/private/resume/image/download',
  apiUrl_RPM_ResumeImageUploadEndpoint: apiUrl_RPM + '/api/private/resume/image/upload',
  apiUrl_RPM_WorkflowEndpoint: apiUrl_RPM + '/api/private/workflow',
  apiUrl_RPM_JobOfferEndpoint: apiUrl_RPM + '/api/private/Job',
  apiUrl_RPM_JobOffer_Upload_MultiFileEndpoint: apiUrl_RPM + '/api/private/Job/upload/multi-files',
  apiUrl_RPM_JobOffer_Delete_MultiFileEndpoint: apiUrl_RPM + '/api/private/Job/multi-file',
  apiUrl_RPM_JobOfferDownloadEndpoint: apiUrl_RPM + '/api/private/Job/download',
  apiUrl_RPM_Update_ResumeEndpoint: apiUrl_IMS + '/api/private/property',
  apiUrl_RPM_JobOffer_TemplateEndpoint: apiUrl_RPM + '/api/private/jobTemplate',
  apiUrl_RPM_JobOffer_ShareEndpoint: apiUrl_RPM + '/api/private/Job/share',
  apiUrl_RPM_JobApplicationEndpoint: apiUrl_RPM + '/api/private/jobApplication',
  apiUrl_RPM_WorkflowBoardEndpoint: apiUrl_RPM + '/api/private/workflow/board',
  apiUrl_RPM_WorkflowBoardItemEndpoint: apiUrl_RPM + '/api/private/workflow/board/event',
  apiUrl_RPM_WorkflowBoardEventEndpoint: apiUrl_RPM + '/api/private/workflow/board/board-event',
  apiUrl_RPM_WorkflowBoardItemsEndpoint: apiUrl_RPM + '/api/private/workflow/board/items',
  apiUrl_RPM_WorkflowBoard_CandidateEndpoint: apiUrl_RPM + '/api/private/workflow/board/candidate',
  apiUrl_RPM_ItemTypesEndpoint: apiUrl_RPM + '/api/private/workflow/board/itemTypes',
  apiUrl_RPM_TimeLineEndpoint: apiUrl_RPM + '/api/private/timeline',
  apiUrl_RPM_RESUME_STATS: apiUrl_RPM + '/api/private/resume/stat',
  apiUrl_RPM_JOB_STATS: apiUrl_RPM + '/api/private/job/stat',

  //===========================================================================
  apiUrl_CMS,
  apiUrl_CMS_CalendarEndpoint: apiUrl_CMS + '/api/private/calendar',
  apiUrl_CMS_CalendarDownloadEndpoint: apiUrl_CMS + '/api/private/calendar/download',
  apiUrl_CMS_CalendarEventEndpoint: apiUrl_CMS + '/api/private/calendar/event',
  apiUrl_CMS_CalendarEventByDomainAndCalendarNameEndpoint:
    apiUrl_CMS + '/api/private/calendar/event/byDomainAndCalendarName',

  //===========================================================================
  apiUrl_HRM,
  apiUrl_HRM_EmployeeEndpoint: apiUrl_HRM + '/api/private/employee',
  apiUrl_HRM_EmployeeStatisticEndpoint: apiUrl_HRM + '/api/private/employee/stat',
  apiUrl_HRM_EmployeeByDomainEndpoint: apiUrl_HRM + '/api/private/employee/domain',
  apiUrl_HRM_EmployeeByCodeEndpoint: apiUrl_HRM + '/api/private/employee/code',
  apiUrl_HRM_EmployeeImageEndpoint: apiUrl_HRM + '/api/private/employee/image',
  apiUrl_HRM_Employee_Upload_MultiFileEndpoint: apiUrl_HRM + '/api/private/employee/upload/multi-files',
  apiUrl_HRM_Employee_Delete_MultiFileEndpoint: apiUrl_HRM + '/api/private/employee/multi-files',
  apiUrl_HRM_Employee_FileDownloadEndpoint: apiUrl_HRM + '/api/private/employee/file/download',
  apiUrl_HRM_EmployeeImageDownloadEndpoint: apiUrl_HRM + '/api/private/employee/image/download',
  apiUrl_HRM_EmployeeImageUploadEndpoint: apiUrl_HRM + '/api/private/employee/image/upload',
  apiUrl_HRM_ContractEndPoint: apiUrl_HRM + '/api/private/contract',
  apiUrl_HRM_ContractFileDownloadEndPoint: apiUrl_HRM + '/api/private/contract/file/download',
  apiUrl_HRM_ContractFileUploadEndPoint: apiUrl_HRM + '/api/private/contract/file/upload',
  apiUrl_HRM_AbsenceEndPoint: apiUrl_HRM + '/api/private/leaveStatus',
  apiUrl_HRM_VacationEndPoint: apiUrl_HRM + '/api/private/vacation',
  apiUrl_HRM_ContractUpdateStatusEndpoint: apiUrl_HRM + '/api/private/contract/updateContractStatus',
  apiUrl_HRM_IdentityDocImageEndPoint: apiUrl_HRM + '/api/private/cin/image',
  apiUrl_HRM_IdentityDocImageDownloadEndPoint: apiUrl_HRM + '/api/private/cin/image/download',
  apiUrl_HRM_TravelDocImageEndPoint: apiUrl_HRM + '/api/private/passport/image',
  apiUrl_HRM_TravelDocImageDownloadEndPoint: apiUrl_HRM + '/api/private/passport/image/download',
  apiUrl_HRM_InsuranceDocImageEndPoint: apiUrl_HRM + '/api/private/security/image',
  apiUrl_HRM_InsuranceDocImageDownloadEndPoint: apiUrl_HRM + '/api/private/security/image/download',
  apiUrl_HRM_EmployeeStatusEndPoint: apiUrl_HRM + '/api/private/employee/updateStatusEmployee',
  apiUrl_HRM_PaymentScheduleEndPoint: apiUrl_HRM + '/api/private/payment-Schedule',

  //===========================================================================
  apiUrl_SCUI,
  apiUrl_SCUI_UserStoryEndpoint: apiUrl_SCUI + '/create',
  apiUrl_SCUI_DeleteUserStoryEndpoint: apiUrl_SCUI + '/deleteUserStory',
  apiUrl_SCUI_AiJobEndpoint: apiUrl_SCUI + '/getAllProjects',
  apiUrl_SCUI_AiJobGetDetailsEndPoint: apiUrl_SCUI + '/getProject',
  apiUrl_SCUI_CreateAIJobEndpoint: apiUrl_SCUI + '/createProject',
  apiUrl_SCUI_GetDataBaseEndpoint: apiUrl_SCUI + '/getDBSchemas',
  apiUrl_SCUI_AiJobDeleteEndPoint: apiUrl_SCUI + '/deleteProject',
  apiUrl_SCUI_AiJobGetRelatedUserStoryEndPoint: apiUrl_SCUI + '/getUserStoriesByProjectId',
  apiUrl_SCUI_UserStoryCreateEndPoint: apiUrl_SCUI + '/create',
  apiUrl_SCUI_UserStoriesCreateEndPoint: apiUrl_SCUI + '/createBatch',
  apiUrl_SCUI_SetLanguageEndPoint: apiUrl_SCUI + '/set_language',
  apiUrl_SCUI_UserStoryGetValidationParamsEndpoint: apiUrl_SCUI + '/validations',
  apiUrl_SCUI_UserStoryGetValidationFunctionEndpoint: apiUrl_SCUI + '/validations',
  apiUrl_SCUI_UserStoryValidateEndpoint: apiUrl_SCUI + '/validates',
  apiUrl_SCUI_UserStoryRemoveParamsEndpoint: apiUrl_SCUI + '/remove',
  apiUrl_SCUI_UserStoryGetSummaryEndpoint: apiUrl_SCUI + '/get',
  apiUrl_SCUI_UserStoryGenerateCodesEndpoint: apiUrl_SCUI + '/code_generate/',
  apiUrl_SCUI_GetProjectHierarchyEndpoint: apiUrl_SCUI + '/get_project_hierarchy/',
  apiUrl_SCUI_UserStoryGetAllUserStoriesMinEndpoint: apiUrl_SCUI + '/getUserStoriesMinByProjectId',
  apiUrl_SCUI_UserStoryRemoveFunctionEndpoint: apiUrl_SCUI + '/remove',
  apiUrl_SCUI_UserStoryDownloadCodeFileEndpoint: apiUrl_SCUI + '',
  apiUrl_SCUI_UserStoryGetProjectDetailsEndpoint: apiUrl_SCUI + '/getProject/',
  apiUrl_SCUI_DependenciesListEndpoint: apiUrl_SCUI + '/getDependencies',
  apiUrl_SCUI_CreateSpringBootEndpoint: apiUrl_SCUI + '/createSpringBootProject',
  apiUrl_SCUI_CompileSpringBootEndpoint: apiUrl_SCUI + '/compileSpringAppJar/',

  //===========================================================================
  apiUrl_LINK,
  apiUrl_LINK_PostEndpoint: apiUrl_LINK + '/api/private/post',
  apiUrl_LINK_PostCommentEndpoint: apiUrl_LINK + '/api/private/comment',
  apiUrl_LINK_UserLikedPostEndpoint: apiUrl_LINK + '/api/private/post/like',
  apiUrl_LINK_UserDislikePostEndpoint: apiUrl_LINK + '/api/private/post/dislike',
  apiUrl_LINK_UserLikedCommentEndpoint: apiUrl_LINK + '/api/private/comment/like',
  apiUrl_LINK_UserDislikeCommentEndpoint: apiUrl_LINK + '/api/private/comment/dislike',
  apiUrl_LINK_UploadImageEndpoint: apiUrl_LINK + '/api/private/post/image',
  apiUrl_LINK_PostImageDownloadEndpoint: apiUrl_LINK + '/api/private/post/image/download'

  //===========================================================================
}

export default apiUrls
