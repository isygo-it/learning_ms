import React, {useCallback, useState} from 'react'
import {DataGrid, GridApi, GridColDef} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'react-i18next'
import Card from '@mui/material/Card'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {deleteAnnexById, fetchAllAnnexs} from '../../../api/annex'
import DeleteCommonDialog from 'template-shared/@core/components/DeleteCommonDialog'
import AddAnnexDrawer from '../../../views/apps/annex/AddAnnexDrawer'
import SidebarEditAnnex from '../../../views/apps/annex/EditAnnexConfig'
import {GridApiCommunity} from '@mui/x-data-grid/internals'
import toast from 'react-hot-toast'
import TableHeader from 'template-shared/views/table/TableHeader'
import {AnnexType} from 'template-shared/types/apps/annexTypes'
import {PermissionAction, PermissionApplication, PermissionPage} from 'template-shared/types/apps/authRequestTypes'
import {checkPermission} from 'template-shared/@core/api/decodedPermission'
import themeConfig from "template-shared/configs/themeConfig";

import Styles from "template-shared/style/style.module.css"


interface CellType {
  row: AnnexType
}

const AnnexList = () => {
  const queryClient = useQueryClient()

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const [editDataAnnex, setEditDataAnnex] = useState<AnnexType>()
  const [addAnnexOpen, setAddAnnexOpen] = useState<boolean>(false)
  const [editAnnexOpen, setEditAnnexOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const toggleEditAnnexDrawer = () => setEditAnnexOpen(!editAnnexOpen)
  const toggleAddAnnexDrawer = () => setAddAnnexOpen(!addAnnexOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)

  const {t} = useTranslation()

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }

  const annexMutationDelete = useMutation({
    mutationFn: (id: number) => deleteAnnexById(id),
    onSuccess: (id: number) => {
      if (id) {
        setDeleteDialogOpen(false)

        const updatedItems: AnnexType[] =
          (queryClient.getQueryData('annexs') as AnnexType[])?.filter((item: AnnexType) => item.id !== id) || []

        toast.success('Annex delete successfully')
        queryClient.setQueryData('annexs', updatedItems)
      }
    }
  })

  function onDelete(id: number) {
    annexMutationDelete.mutate(id)
  }

  const {data: AnnexList, isLoading} = useQuery('annexs', () => fetchAllAnnexs())

  const tableCodeList = AnnexList?.map(annex => annex.tableCode)
  const uniqueTableCodes: string[] = Array.from(new Set(tableCodeList))

  function handleOpenEdit(data: AnnexType) {
    setEditAnnexOpen(true)
    setEditDataAnnex(data)
  }

  const columns: GridColDef[] = [
    {
      field: 'tableCode',
      headerName: t('tableCode') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.tableCode}</Typography>
    },
    {
      field: 'value',
      headerName: t('Parameter.Value') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.value}</Typography>
    },
    {
      field: 'Reference',
      headerName: t('Reference') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.reference}</Typography>
    },
    {
      field: 'Language',
      headerName: t('Language') as string,
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row?.language}</Typography>
    },
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Tooltip title={row.description}>
            <IconButton
              className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
              <Icon icon='tabler:info-circle'/>
            </IconButton>
          </Tooltip>

          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ANNEX, PermissionAction.DELETE) && (
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}}
                onClick={() => handleOpenDeleteDialog(row.id ?? 0)}
              >
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>
          )}
          {/*{checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ANNEX, PermissionAction.WRITE) && (*/}
            <Tooltip title={t('Action.Save')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{color: 'text.secondary'}} onClick={() => handleOpenEdit(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>
          {/*)}*/}
        </Box>
      )
    }
  ]

  return (
    <>
      {!isLoading ? (
        <Grid container spacing={6.5}>
          <Grid item xs={12}>
            <Card>
              <TableHeader
                dataGridApi={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
                value={value}
                handleFilter={handleFilter}
                toggle={toggleAddAnnexDrawer}
                permissionApplication={PermissionApplication.SYSADMIN}
                permissionPage={PermissionPage.ANNEX}
                permissionAction={PermissionAction.WRITE}
              />
              {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ANNEX, PermissionAction.READ) && (
                <Box className={Styles.boxTable}>
                  <DataGrid
                    autoHeight
                    pagination

                    className={Styles.tableStyleNov}
                    columnHeaderHeight={themeConfig.columnHeaderHeight}
                    rowHeight={themeConfig.rowHeight}
                    rows={AnnexList || []}
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
          {/*{checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ANNEX, PermissionAction.WRITE) && (*/}
            <AddAnnexDrawer open={addAnnexOpen} toggle={toggleAddAnnexDrawer} uniqueTableCodes={uniqueTableCodes}/>
          {/*)}*/}

          {checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ANNEX, PermissionAction.DELETE) && (
            <DeleteCommonDialog
              open={deleteDialogOpen}
              setOpen={setDeleteDialogOpen}
              selectedRowId={selectedRowId}
              onDelete={onDelete}
              item='Annex'
            />
          )}

          {editAnnexOpen &&
          checkPermission(PermissionApplication.SYSADMIN, PermissionPage.ANNEX, PermissionAction.WRITE) && (
            <SidebarEditAnnex open={editAnnexOpen} toggle={toggleEditAnnexDrawer} dataParameter={editDataAnnex} uniqueTableCodes={uniqueTableCodes}/>
          )
            }
        </Grid>
      ) : null}
    </>
  )
}
export default AnnexList
