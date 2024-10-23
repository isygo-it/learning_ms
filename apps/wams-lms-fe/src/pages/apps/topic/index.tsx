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
import AddTopicDrawer from "../../../views/apps/topic/view/AddTopicDrawer";
import {TopicTypes} from "../../../types/apps/topicTypes";
import {deleteTopicById, fetchAllTopics} from "../../../views/apps/topic/view";
import {fetchProfileFullData} from "template-shared/@core/api/account";
import apiUrls from "template-shared/configs/apiUrl";
import EditTopicDrawer from "../../../views/apps/topic/view/EditTopicDrawer";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import TopicCard from "../../../views/apps/topic/view/TopicCard";

const TopicList = () => {
  const queryClient = useQueryClient()

  interface CellType {
    row: TopicTypes
  }

  const [value, setValue] = useState<string>('')
  const dataGridApiRef = React.useRef<GridApi>()
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const [addTopicOpen, setAddTopicOpen] = useState<boolean>(false)
   const [editTopicOpen, setEditTopicOpen] = useState<boolean>(false)
  const [editDataTopic, setEditDataTopic] = useState<TopicTypes>()
  const toggleEditTopicDrawer = () => setEditTopicOpen(!editTopicOpen)

  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const toggleAddTopicDrawer = () => setAddTopicOpen(!addTopicOpen)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedRowId, setSelectedRowId] = useState<number>(0)
  const {t} = useTranslation()
  const {data: TopicLists, isLoading} = useQuery('TopicLists', fetchAllTopics)
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


  function handleOpenEdit(data: TopicTypes) {
    setEditTopicOpen(true)
    setEditDataTopic(data)
  }


  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteTopicById(id),
    onSuccess: (id: number) => {
      console.log(id)
      if (id) {
        setDeleteDialogOpen(false)
        const updatedItems = TopicLists.filter(q => q.id !== id)
        queryClient.setQueryData('TopicLists', updatedItems)
      }
    },
    onError: err => {
      console.log(err)
    }
  })

  function onDelete(id: number) {
    mutationDelete.mutate(id)
  }
  const [selectedFile] = useState<File | undefined>(undefined)
  const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery(
    'profileUser',
    fetchProfileFullData
  )
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
                src={row.imagePath ? `${apiUrls.apiUrl_LMS_LMSTopicImageDownloadEndpoint}/${row.id}?${Date.now()}` : ''}
                alt={row.name}
        />
      )
    },

    /*Domain column*/
    {
      field: 'domain',
      headerName: t('domain') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
    },

    /*Code column*/
    {
      field: 'code',
      headerName: t('Code') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
    },

    /*Name column*/
    {
      field: 'name',
      headerName: t('name') as string,
      type: 'string',
      flex: 1,
      renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.name}</Typography>
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
            <Tooltip title={t(row.description)}>
              <IconButton className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                <Icon icon='tabler:info-circle'/>
              </IconButton>
            </Tooltip>

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
        rows={TopicLists || []}
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
      {TopicLists &&
        Array.isArray(TopicLists) &&
        TopicLists.map((item, index) => {

          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <TopicCard
                data={item}
                onDeleteClick={handleOpenDeleteDialog}
                onEditClick={handleOpenEdit}
                imageUrl={apiUrls.apiUrl_LMS_LMSTopicImageDownloadEndpoint}
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
            toggle={toggleAddTopicDrawer}
          />
          {renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser && addTopicOpen && <AddTopicDrawer open={addTopicOpen} domain={profileUser?.domain} toggle={toggleAddTopicDrawer}/>}

      <DeleteCommonDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        selectedRowId={selectedRowId}
        item='Topic'
        onDelete={onDelete}
      />



      {editTopicOpen && (
        <EditTopicDrawer
          open={editTopicOpen}
          toggle={toggleEditTopicDrawer}
          dataTopic={editDataTopic}
          selectedFile={selectedFile}
        />
      )}

    </Grid>
  ) : null
}

export default TopicList
