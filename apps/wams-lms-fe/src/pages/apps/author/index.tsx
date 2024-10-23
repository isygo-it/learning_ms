// ** React Imports
import React, {useCallback, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from "react-query";
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Styles from "template-shared/style/style.module.css";
import Icon from "template-shared/@core/components/icon";
import themeConfig from "template-shared/configs/themeConfig";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import {Avatar, ToggleButton, ToggleButtonGroup} from "@mui/material";
import TableHeader from "template-shared/views/table/TableHeader";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";
import apiUrls from "template-shared/configs/apiUrl";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import {AuthorTypes} from "../../../types/apps/authorTypes";
import {deleteAuthorById, fetchAllAuthors} from "../../../views/apps/author/view";
import AuthorCard from "../../../views/apps/author/view/AuthorCard";
import AddAuthorDrawer from "../../../views/apps/author/view/AddAuthorDrawer";
import EditAuthorDrawer from "../../../views/apps/author/view/EditAuthorDrawer";

const AuthorList = () => {
  const queryClient = useQueryClient()

  interface CellType {
    row: AuthorTypes
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const [addAuthorOpen, setAddAuthorOpen] = useState<boolean>(false)
  const [editAuthorOpen, setEditAuthorOpen] = useState<boolean>(false)
  const [editDataAuthor, setEditDataAuthor] = useState<AuthorTypes>()
  const toggleEditAuthorDrawer = () => setEditAuthorOpen(!editAuthorOpen)

  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const toggleAddAuthorDrawer = () => setAddAuthorOpen(!addAuthorOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const {t} = useTranslation()
  const {data: AuthorLists, isLoading} = useQuery('AuthorLists', fetchAllAuthors)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [viewMode, setViewMode] = useState('auto')

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'))
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'))
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'))
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
  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true)
    setSelectedRowId(id)
  }


  function handleOpenEdit(data: AuthorTypes) {
    setEditAuthorOpen(true)
    setEditDataAuthor(data)
  }


  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteAuthorById(id),
    onSuccess: (id: number) => {
      console.log(id)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems = AuthorLists.filter(q => q.id !== id)
        queryClient.setQueryData('AuthorLists', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
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
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => (
        <Avatar className={Styles.avatarTable}
                src={row.imagePath ? `${apiUrls.apiUrl_LMS_LMSAuthorImageDownloadEndpoint}/${row.id}?${Date.now()}` : ''}
                alt={row.firstname}
        />
      )
    },

    /*Code column*/
    {
      field: 'code',
      headerName: t('code') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
    },

    /*Firstname column*/
    {
      field: 'firstname',
      headerName: t('firstname') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.firstname}</Typography>
    },


    /*Lastname column*/
    {
      field: 'lastname',
      headerName: t('lastname') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.lastname}</Typography>
    },

    /*Email column*/
    {
      field: 'email',
      headerName: t('email') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.email}</Typography>
    },

    /*Phone column*/
    {
      field: 'phone',
      headerName: t('phone') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.phone}</Typography>
    }

  ]

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({row}: CellType) => {

        return (
          <Box sx={{display: 'flex', alignItems: 'center'}}>


            <Tooltip title={t('Action.Edit')}>
              <IconButton
                className={Styles.sizeIcon} sx={{color: 'text.secondary'}} onClick={() => handleOpenEdit(row)}>
                <Icon icon='tabler:edit'/>
              </IconButton>
            </Tooltip>

            <Tooltip title={t('Action.Delete')}>
              <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}
                          onClick={() => handleOpenDeleteDialog(row.id)}>
                <Icon icon='tabler:trash'/>
              </IconButton>
            </Tooltip>

          </Box>
        )
      }
    }
  ]


  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        pagination

        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={AuthorLists || []}
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
          }
        }}
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  )

  const cardView = (
    <Grid container spacing={3} sx={{mb: 2, padding: '15px'}}>
      {AuthorLists &&
        Array.isArray(AuthorLists) &&
        AuthorLists.map((item, index) => {

          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <AuthorCard
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                onEditClick={handleOpenEdit}
                imageUrl={apiUrls.apiUrl_LMS_LMSAuthorImageDownloadEndpoint}
              />
            </Grid>
          )
        })}
    </Grid>
  )

  return !isLoading ? (
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
            dataGridApi={dataGridApiRef}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddAuthorDrawer}
          />
          {renderViewBasedOnMode()}
        </Card>
      </Grid>

      {addAuthorOpen && <AddAuthorDrawer open={addAuthorOpen} toggle={toggleAddAuthorDrawer}/>}

      <DeleteCommonDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        selectedRowId={selectedRowId}
        item='Author'
        onDelete={onDelete}
      />


      {editAuthorOpen && (
        <EditAuthorDrawer
          open={editAuthorOpen}
          toggle={toggleEditAuthorDrawer}
          dataAuthor={editDataAuthor}
        />
      )}

    </Grid>
  ) : null
}

export default AuthorList
