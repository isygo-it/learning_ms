import React, {useCallback, useState} from 'react'
import {
  Avatar,
  Box,
  Card,
  Grid,
  IconButton,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Styles from "template-shared/style/style.module.css"


import Icon from 'template-shared/@core/components/icon'
import CustomChip from 'template-shared/@core/components/mui/chip'

import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import apiUrls from 'template-shared/configs/apiUrl'
import {useTheme} from '@mui/material/styles'
import AccountCard from '../../../../views/apps/account-management/list/AccountCard'
import UpdateAdminStatusDialog
  from 'template-shared/@core/components/common-update-admin-status/UpdateAdminStatusDialog'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {deleteAccount, fetchAllAccounts, resendEmailCreation} from '../../../../api/account'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import AddAccountDrawer from '../../../../views/apps/account-management/list/AddAccountDrawer'
import TableHeader from 'template-shared/views/table/TableHeader'
import {checkPermission} from 'template-shared/@core/api/decodedPermission'
import {PermissionAction, PermissionApplication, PermissionPage} from 'template-shared/types/apps/authRequestTypes'
import toast from 'react-hot-toast'
import Moment from 'react-moment'
import UpdateIsAdminDialog from 'template-shared/@core/components/common-update-is-admin/UpdateIsAdminDialog'
import {AccountsTypes, systemStatusObj} from 'template-shared/types/apps/accountTypes'
import themeConfig from 'template-shared/configs/themeConfig'
import AccountStatisticsContainer from "../accountStatistic/AccountstatisticsContainer";
import {fetchProfileFullData} from "template-shared/@core/api/account";
import LockResetIcon from '@mui/icons-material/LockReset';

interface CellType {
  row: AccountsTypes
}

const AccountList = () => {
  const queryClient = useQueryClient()

  // ** State
  const [value, setValue] = useState<string>('')
  const [addAccountOpen, setAddAccountOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const [newStatus, setNewStatus] = useState<boolean>(false)
  const [newStatusIsAdmin, setNewStatusIsAdmin] = useState<boolean>(false)
  const [updateIsAdminDialogOpen, setUpdateIsAdminDialogOpen] = useState<boolean>(false)

  const [viewMode, setViewMode] = useState('auto')

  // ** Hooks
  const router = useRouter()
  const theme = useTheme()
  const {t} = useTranslation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dataGridApiRef = React.useRef<GridApi>()

  const {data: accounts, isLoading} = useQuery(`accounts`, () => fetchAllAccounts())
  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onSuccess: (id: number) => {
      console.log(id)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: AccountsTypes[] =
          (queryClient.getQueryData('accounts') as AccountsTypes[])?.filter((item: AccountsTypes) => item.id !== id) ||
          []
        queryClient.setQueryData('accounts', updatedItems)
      }
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
  }

  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
  }
  const renderViewBasedOnMode = () => {
    if (isMobile && viewMode === 'auto') {
      return cardView
    } else if (!isMobile && viewMode === 'auto') {
      return gridView
    } else if (viewMode === 'grid') {
      return gridView
    } else if (viewMode === 'card') {
      return cardView
    }
  }

  const handleResendEmailCreation = (id: number) => {
    mutationResendEmail.mutate(id)
  }

  const mutationResendEmail = useMutation({
    mutationFn: (id: number) => resendEmailCreation(id),
    onSuccess: (id: number) => {
      if (id) {
        toast.success('Resend successfully')
      }
    }
  })

  const handleOpenUpdateStatusDialog = (rowId: number, status: boolean) => {
    setUpdateStatusDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatus(!status)
  }
  const handleOpenUpdateIsAdmin = (rowId: number, status: boolean) => {
    setUpdateIsAdminDialogOpen(true)
    setSelectedRowId(rowId)
    setNewStatusIsAdmin(status)
  }

  const handleClickView = (id: number) => {
    router.push(`/apps/account-management/view/account/${id}`)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    origin: false,
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const defaultColumns: GridColDef[] = [
    /*Photo column*/
    {
      field: 'photo',
      headerName: t('Photo') as string,
      flex: 0.15,
      minWidth: 100,
      renderCell: ({row}: CellType) => (
        <Avatar
          className={Styles.avatarTable}
          src={
            row.imagePath !== 'defaultPhoto.jpg' ? `${apiUrls.apiUrl_IMS_AccountImageDownloadEndpoint}/${row.id}` : ''
          }
          alt={row.accountDetails?.firstName}
        />
      )
    },

    /*Domain column*/
    {
      field: 'domain',
      flex: 0.15,
      minWidth: 170,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },

    /*User Name column*/
    {
      field: 'username',
      flex: 0.15,
      minWidth: 140,
      headerName: t('Username') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.code}
            </Typography>
          </Box>
        )
      }
    },

    /*Full Name column*/
    {
      field: 'fullName',
      flex: 0.15,
      minWidth: 140,
      headerName: t('Full_Name') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.accountDetails.firstName} {row.accountDetails.lastName}
            </Typography>
          </Box>
        )
      }
    },

    /*Email column*/
    {
      field: 'email',
      flex: 0.25,
      minWidth: 200,
      headerName: t('Email') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{color: 'text.secondary'}}>
            {row.email}
          </Typography>
        )
      }
    },

    /*Func. Role column*/
    {
      field: 'Function role',
      flex: 0.25,
      minWidth: 200,
      headerName: t('Role.Functional_Role') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{color: 'text.secondary'}}>
            {row.functionRole}
          </Typography>
        )
      }
    },

    /*Is Admin column*/
    {
      field: 'isAdmin',
      minWidth: 140,
      flex: 0.15,
      headerName: t('IsAdmin') as string,
      renderCell: ({row}: CellType) => {
        return (
          <>
            {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={row.isAdmin}
                      onChange={e => handleOpenUpdateIsAdmin(row.id, e.target.checked)}/>
            ) : (
              <Switch size={'small'} checked={row.isAdmin} readOnly={true}/>
            )}
          </>
        )
      }
    },

    /*Last login date column*/
    {
      field: 'loginDate',
      flex: 0.15,
      minWidth: 155,
      sortable: false,
      headerName: t('lastLoginDate') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary', fontSize: '14px'}}>
              {row.connectionTrackings && row.connectionTrackings?.length > 0 ? (
                <Moment format='DD-MM-YYYY HH:mm:ss'>
                  {row.connectionTrackings?.length > 0 ? row.connectionTrackings[0]?.loginDate : '-'}
                </Moment>
              ) : null}
            </Typography>
          </Box>
        )
      }
    },

    /*Admin status column*/
    {
      field: 'adminStatus',
      flex: 0.15,
      minWidth: 150,
      headerName: t('Admin_Status') as string,
      renderCell: ({row}: CellType) => {
        const status = row.adminStatus === 'ENABLED'

        return (
          <>
            {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.WRITE) ? (
              <Switch size={'small'} checked={status}
                      onChange={() => handleOpenUpdateStatusDialog(row.id ?? 0, status)}/>
            ) : (
              <Switch size={'small'} checked={status}/>
            )}
          </>
        )
      }
    },

    /*System status column*/
    {
      field: 'systemStatus',
      flex: 0.15,
      minWidth: 170,
      headerName: t('System_status') as string,
      renderCell: ({row}: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            className={Styles.sizeCustomChip}
            label={row.systemStatus}
            color={systemStatusObj[row.systemStatus as string]}

          />
        )
      }
    },

    /*Origin column*/
    {
      flex: 0.15,
      field: 'origin',
      minWidth: 140,
      headerName: t('Origin') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.origin}
            </Typography>
          </Box>
        )
      }
    },

    /*create Date column*/
    {
      field: 'createDate',
      minWidth: 140,
      flex: 0.15,
      headerName: t('AuditInfo.createDate') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              <Moment format='DD-MM-YYYY'>{row.createDate}</Moment>
            </Typography>
          </Box>
        )
      }
    },

    /*createdBy column*/
    {
      field: 'createdBy',
      minWidth: 140,
      flex: 0.15,
      headerName: t('AuditInfo.createdBy') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.createdBy}
            </Typography>
          </Box>
        )
      }
    },

    /*Last update Date column*/
    {
      field: 'updateDate',
      flex: 0.15,
      minWidth: 140,
      headerName: t('AuditInfo.updateDate') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              <Moment format='DD-MM-YYYY'>{row.updateDate}</Moment>
            </Typography>
          </Box>
        )
      }
    },

    /*updatedBy column*/
    {
      field: 'updatedBy',
      flex: 0.15,
      minWidth: 140,
      headerName: t('AuditInfo.updatedBy') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.updatedBy}
            </Typography>
          </Box>
        )
      }
    }
  ]
  const toggleAddAccountDrawer = () => setAddAccountOpen(!addAccountOpen)
  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    fetchProfileFullData
  )


  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      flex: 0.15,
      minWidth: 150,
      sortable: false,
      headerName: '' as string,
      align: 'right',
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.DELETE) ? (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => handleOpenDeleteDialog(row.id ?? 0)}
              >
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          ) : null}

          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT_DETAIL, PermissionAction.READ) ? (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => {
                  row.id && handleClickView(row.id)
                }}
              >
                <Icon icon='fluent:slide-text-edit-24-regular'/>
              </IconButton>
            </Tooltip>
          ) : null}

          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.CUSTOMER, PermissionAction.WRITE) ? (
            <Tooltip title={t('Action.ResetPassword')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => {
                  row.id && handleResendEmailCreation(row.id)
                }}
              >
                <LockResetIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      )
    }
  ]
  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        autoHeight
        rows={accounts || []}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
        columns={columns}
        disableRowSelectionOnClick

        pageSizeOptions={themeConfig.pageSizeOptions}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          pagination: {
            labelRowsPerPage: t('Rows_per_page'),
            labelDisplayedRows: ({from, to, count}) => t('pagination footer', {from, to, count})
          },
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {debounceMs: 500}
          }
        }}
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {accounts &&
      Array.isArray(accounts) &&
      accounts.map((item, index) => {
        return (
          <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
            <AccountCard
              handleResendEmailCreation={handleResendEmailCreation}
              data={item}
              onDeleteClick={handleOpenDeleteDialog}
              imageUrl={apiUrls.apiUrl_IMS_AccountImageDownloadEndpoint}
              onSwitchStatus={handleOpenUpdateStatusDialog}
              onViewClick={handleClickView}
            />
          </Grid>
        )
      })}{' '}
    </Grid>
  )

  return !isLoading ? (
      <>
        <AccountStatisticsContainer/>
        <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
            <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode} aria-label='text alignment'>
              <ToggleButton value='grid' aria-label='left aligned'>
                <Icon icon='ic:baseline-view-list'/>
              </ToggleButton>
              <ToggleButton value='card' aria-label='center aligned'>
                <Icon icon='ic:baseline-view-module'/>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddAccountDrawer}
            permissionApplication={PermissionApplication.SYSADMIN}
            permissionPage={PermissionPage.ACCOUNT}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.READ) ? (
            renderViewBasedOnMode()
          ) : null}
        </Card>
      </Grid>

      {!isLoadingProfileUser && addAccountOpen &&
      checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
        <AddAccountDrawer open={addAccountOpen} toggle={toggleAddAccountDrawer} domain={profileUser?.domain}/>
      )}

      {deleteDialogOpen &&
      checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='Account'
          onDelete={onDelete}
        />
      )}

      {updateStatusDialogOpen &&
      checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
        <UpdateAdminStatusDialog
          open={updateStatusDialogOpen}
          setOpen={setUpdateStatusDialogOpen}
          setSelectedRowId={selectedRowId}
          item='Account'
          newStatus={newStatus}
        />
      )}

      {updateIsAdminDialogOpen &&
      checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ACCOUNT, PermissionAction.WRITE) && (
        <UpdateIsAdminDialog
          open={updateIsAdminDialogOpen}
          setOpen={setUpdateIsAdminDialogOpen}
          setSelectedRowId={selectedRowId}
          item='Account'
          newStatus={newStatusIsAdmin}
        />
      )}
    </Grid>
      </>
  ) : null
}

export default AccountList
