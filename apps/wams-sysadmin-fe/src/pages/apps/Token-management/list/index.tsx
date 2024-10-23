// ** React Imports
import React, {useCallback, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'template-shared/@core/components/icon'

// ** Store Imports
// ** Types Imports
// ** Custom Table Components Imports
import Tooltip from '@mui/material/Tooltip'
import DeleteRoleDialog from 'template-shared/@core/components/DeleteCommonDialog'
import {TokenConfigType} from '../../../../types/apps/tokenConfig'
import {useTranslation} from 'react-i18next'
import EditTokenConfig from '../../../../views/apps/token-management/list/EditTokenConfig'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {deleteToken, fetchData} from '../../../../api/token-management'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import TableHeader from 'template-shared/views/table/TableHeader'
import AddTokenConfig from '../../../../views/apps/token-management/list/AddTokenConfig'
import {PermissionAction, PermissionApplication, PermissionPage} from 'template-shared/types/apps/authRequestTypes'
import {checkPermission} from 'template-shared/@core/api/decodedPermission'
import themeConfig from "template-shared/configs/themeConfig";

import Styles from "template-shared/style/style.module.css";


interface CellType {
  row: TokenConfigType
}

const TokenManagement = () => {
  const queryClient = useQueryClient()

  // ** State
  const [value, setValue] = useState<string>('')
  const [addTokenOpen, setAddTokenOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [editDataToken, setEditDataToken] = useState<TokenConfigType>()
  const [editTokenOpen, setEditTokenOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const toggleEditRoleDrawer = () => setEditTokenOpen(!editTokenOpen)
  const {t} = useTranslation()
  const handleOpenDeleteDialog = (rowId: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(rowId)
  }

  async function handelOpenEdit(data: TokenConfigType) {
    setEditTokenOpen(true)
    setEditDataToken(data)
  }

  // ** Hooks
  const dataGridApiRef = React.useRef<GridApi>()

  const {data: tokens, isLoading, isStale} = useQuery(`tokens`, () => fetchData())
  console.log('isStale', isStale)

  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteToken(id),
    onSuccess: (tokenId: number) => {
      if (tokenId) {
        setDeleteDialogOpen(false)
        const updatedItems: TokenConfigType[] =
          (queryClient.getQueryData('tokens') as TokenConfigType[])?.filter(
            (item: TokenConfigType) => item.id !== tokenId
          ) || []
        queryClient.setQueryData('tokens', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const columns: GridColDef[] = [
    {
      flex: 0.15,
      field: 'domain',
      minWidth: 170,
      headerName: t('Domain.Domain') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary', textTransform: 'capitalize'}}>
              {row.domain}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.14,
      minWidth: 170,
      field: 'code',
      headerName: t('code') as string,
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
    {
      flex: 0.15,
      field: 'tokenType',
      minWidth: 170,
      headerName: t('Token.Token_Type') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.tokenType}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: t('Token.issuer') as string,
      field: 'issuer',
      renderCell: ({row}: CellType) => {
        return (
          <Typography noWrap sx={{fontWeight: 500, color: 'text.secondary'}}>
            {row.issuer}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'audience',
      minWidth: 170,
      headerName: t('Token.audience') as string,
      renderCell: ({row}: CellType) => {
        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography noWrap sx={{color: 'text.secondary'}}>
              {row.audience}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      renderCell: ({row}: CellType) => (
        <>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {checkPermission(PermissionApplication.KMS, PermissionPage.TOKEN_CONFIG, PermissionAction.DELETE) && (
              <Tooltip title={t('Action.Delete')}>
                <IconButton
                  className={Styles.sizeIcon}
                  sx={{color: 'text.secondary'}}
                  onClick={() => handleOpenDeleteDialog(row.id)}
                >
                  <Icon icon='tabler:trash'/>
                </IconButton>
              </Tooltip>
            )}
            {checkPermission(PermissionApplication.KMS, PermissionPage.TOKEN_CONFIG, PermissionAction.WRITE) && (
              <Tooltip title={t('Action.Edit')}>
                <IconButton
                  className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handelOpenEdit(row)}>
                  <Icon icon='tabler:edit'/>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </>
      )
    }
  ]
  const toggleAddTokenDrawer = () => setAddTokenOpen(!addTokenOpen)

  return !isLoading && tokens ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddTokenDrawer}
            permissionApplication={PermissionApplication.KMS}
            permissionPage={PermissionPage.TOKEN_CONFIG}
            permissionAction={PermissionAction.WRITE}
          />
          {checkPermission(PermissionApplication.KMS, PermissionPage.TOKEN_CONFIG, PermissionAction.READ) && (
            <Box className={Styles.boxTable}>
              <DataGrid
                autoHeight

                className={Styles.tableStyleNov}
                columnHeaderHeight={themeConfig.columnHeaderHeight}
                rowHeight={themeConfig.rowHeight}
                rows={tokens || []}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={themeConfig.pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: t('Rows_per_page'),
                    labelDisplayedRows: ({from, to, count}) => t('pagination footer', {from, to, count})
                  }
                }}
                apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
              />
            </Box>
          )}
        </Card>
      </Grid>
      {addTokenOpen &&
      checkPermission(PermissionApplication.KMS, PermissionPage.TOKEN_CONFIG, PermissionAction.WRITE) && (
        <AddTokenConfig open={addTokenOpen} toggle={toggleAddTokenDrawer}/>
      )}
      {editTokenOpen &&
      checkPermission(PermissionApplication.KMS, PermissionPage.TOKEN_CONFIG, PermissionAction.WRITE) && (
        <EditTokenConfig open={editTokenOpen} toggle={toggleEditRoleDrawer} dataToken={editDataToken}/>
      )}
      {deleteDialogOpen &&
      checkPermission(PermissionApplication.KMS, PermissionPage.TOKEN_CONFIG, PermissionAction.DELETE) && (
        <DeleteRoleDialog
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          selectedRowId={selectedRowId}
          item='Token'
          onDelete={onDelete}
        />
      )}
    </Grid>
  ) : null
}

export default TokenManagement
