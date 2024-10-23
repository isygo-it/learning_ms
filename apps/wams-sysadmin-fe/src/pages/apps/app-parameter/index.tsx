// ** React Imports
import React, {useCallback, useState} from 'react'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'
import Card from '@mui/material/Card'
import {AppParameter} from '../../../types/apps/appParameterTypes'

import AddParameterDrawer from '../../../views/apps/appParameter/AddParameterDrawer'

import SidebarEditParameter from '../../../views/apps/appParameter/EditParameterConfig'

import {useMutation, useQuery, useQueryClient} from 'react-query'

import {deleteParametreById, fetchAllParametre} from '../../../api/parametre'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import CardHeader from '@mui/material/CardHeader'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import {PermissionAction, PermissionApplication, PermissionPage} from 'template-shared/types/apps/authRequestTypes'
import {checkPermission} from 'template-shared/@core/api/decodedPermission'
import Moment from 'react-moment'
import themeConfig from "template-shared/configs/themeConfig";

import Styles from "template-shared/style/style.module.css"
import {fetchProfileFullData} from "template-shared/@core/api/account";


const AppParameterList = () => {
  const queryClient = useQueryClient()

  interface CellType {
    row: AppParameter
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataParameter, setEditDataParameter] = useState<AppParameter>()
  const [addParameterOpen, setAddParameterOpen] = useState<boolean>(false)
  const [editParameterOpen, setEditParameterOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const toggleEditParameterDrawer = () => setEditParameterOpen(!editParameterOpen)
  const toggleAddParameterDrawer = () => setAddParameterOpen(!addParameterOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)

  const {t} = useTranslation()
  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    fetchProfileFullData
  )
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  function onDelete(id: number) {
    parametreMutationDelete.mutate(id)
  }

  const parametreMutationDelete = useMutation({
    mutationFn: (id: number) => deleteParametreById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems: AppParameter[] =
          (queryClient.getQueryData('parametres') as AppParameter[])?.filter((item: AppParameter) => item.id !== id) ||
          []
        queryClient.setQueryData('parametres', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  const {data: appParametersList, isLoading} = useQuery('parametres', () => fetchAllParametre())

  function handleOpenEdit(data: AppParameter) {
    setEditParameterOpen(true)
    setEditDataParameter(data)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  })

  const defaultColumns: GridColDef[] = [
    /*Domain column*/
    {
      field: 'domain',
      headerName: t('Domain.Domain') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },

    /*Name column*/
    {
      field: 'name',
      headerName: t('Name') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.name}</Typography>
    },

    /*Value column*/
    {
      field: 'value',
      headerName: t('Parameter.Value') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.value}</Typography>
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

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      maxWidth: 150,
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Tooltip title={t(row.description)}>
            <IconButton
              className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
              <Icon icon='tabler:info-circle'/>
            </IconButton>
          </Tooltip>
          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                onClick={() => handleOpenDeleteDialog(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}
          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleOpenEdit(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  return !isLoading ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('System_Parameters')}/>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddParameterDrawer}
            permissionApplication={PermissionApplication.SYSADMIN}
            permissionPage={PermissionPage.APP_PARAMETER}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.APP_PARAMETER, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight
                pagination
                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={appParametersList || []}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: t('Rows_per_page:'),
                    labelDisplayedRows: ({from, to, count}) => t('pagination footer', {from, to, count})
                  }
                }}
                apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              />
            </Box>
          )}
        </Card>
      </Grid>

      {!isLoadingProfileUser && checkPermission(PermissionApplication.SYSADMIN, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
        <AddParameterDrawer open={addParameterOpen} domain={profileUser?.domain} toggle={toggleAddParameterDrawer}/>
      )}

      {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.APP_PARAMETER, PermissionAction.DELETE) && (
        <DeleteCommonDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          onDelete={onDelete}
          item='Parametre'
        />
      )}

      {editParameterOpen &&
      checkPermission(PermissionApplication.SYSADMIN, PermissionPage.APP_PARAMETER, PermissionAction.WRITE) && (
        <SidebarEditParameter
          open={editParameterOpen}
          toggle={toggleEditParameterDrawer}
          dataParameter={editDataParameter}
        />
      )}
    </Grid>
  ) : null
}
export default AppParameterList
