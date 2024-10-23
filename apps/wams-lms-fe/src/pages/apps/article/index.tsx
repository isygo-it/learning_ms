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
import { ToggleButton, ToggleButtonGroup} from "@mui/material";
import TableHeader from "template-shared/views/table/TableHeader";
import DeleteCommonDialog from "template-shared/@core/components/DeleteCommonDialog";
import {fetchProfileFullData} from "template-shared/@core/api/account";
import apiUrls from "template-shared/configs/apiUrl";
import {GridApiCommunity} from "@mui/x-data-grid/internals";
import {ArticleTypes} from "../../../types/apps/articleTypes";
import {deleteArticleById, fetchAllArticles} from "../../../views/apps/article/view";
import ArticleCard from "../../../views/apps/article/view/ArticleCard";
import AddArticleDrawer from "../../../views/apps/article/view/AddArticleDrawer";
import { useRouter } from 'next/router';

const ArticleList = () => {
  const queryClient = useQueryClient();
  const router = useRouter();  // Use useRouter from next/router

  interface CellType {
    row: ArticleTypes;
  }

  const [value, setValue] = useState<string>('');
  const dataGridApiRef = React.useRef<GridApi>();
  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  const [addArticleOpen, setAddArticleOpen] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const toggleAddArticleDrawer = () => setAddArticleOpen(!addArticleOpen);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number>(0);
  const { t } = useTranslation();
  const { data: ArticleLists, isLoading } = useQuery('ArticleLists', fetchAllArticles);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState('auto');

  const toggleViewMode = () => {
    if (isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'grid' : 'card'));
    } else if (!isMobile && viewMode === 'auto') {
      setViewMode(prevViewMode => (prevViewMode === 'auto' ? 'card' : 'grid'));
    } else setViewMode(prevViewMode => (prevViewMode === 'grid' ? 'card' : 'grid'));
  };

  const renderViewBasedOnMode = () => {
    if (isMobile && viewMode === 'auto') {
      return cardView;
    } else if (!isMobile && viewMode === 'auto') {
      return gridView;
    } else if (viewMode === 'grid') {
      return gridView;
    } else if (viewMode === 'card') {
      return cardView;
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialogOpen(true);
    setSelectedRowId(id);
  };

  const handleView = (id: number) => {
      router.push(`/apps/article/view/ArticleView/${id}`);
  };

  const mutationDelete = useMutation({
    mutationFn: (id: number) => deleteArticleById(id),
    onSuccess: (id: number) => {
      console.log(id);
      if (id) {
        setDeleteDialogOpen(false);
        const updatedItems = ArticleLists.filter(q => q.id !== id);
        queryClient.setQueryData('ArticleLists', updatedItems);
      }
    },
    onError: err => {
      console.log(err);
    }
  });

  function onDelete(id: number) {
    mutationDelete.mutate(id);
  }

  const { data: profileUser, isLoading: isLoadingProfileUser } = useQuery('profileUser', fetchProfileFullData);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({
    createDate: false,
    createdBy: false,
    updateDate: false,
    updatedBy: false
  });

  const defaultColumns: GridColDef[] = [
    /*Domain column*/
    {
      field: 'domain',
      headerName: t('domain') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.domain}</Typography>
    },

    /*Code column*/
    {
      field: 'code',
      headerName: t('Code') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.code}</Typography>
    },

    /*Title column*/
    {
      field: 'title',
      headerName: t('title') as string,
      type: 'string',
      flex: 1,
      renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.title}</Typography>
    }
  ];

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      field: 'actions',
      headerName: '' as string,
      align: 'right',
      flex: 1,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t(row.description)}>
              <IconButton className={Styles.sizeIcon} sx={{ color: 'text.secondary' }}>
                <Icon icon='tabler:info-circle' />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Action.Delete')}>
              <IconButton
                className={Styles.sizeIcon}
                sx={{ color: 'text.secondary' }}
                onClick={() => handleOpenDeleteDialog(row.id)}
              >
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('Action.Edit')}>
              <IconButton className={Styles.sizeIcon} sx={{ color: 'text.secondary' }} onClick={() => handleView(row.id)}>
                <Icon icon='fluent:slide-text-edit-24-regular' />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  ];

  const gridView = (
    <Box className={Styles.boxTable}>
      <DataGrid
        autoHeight
        pagination
        className={Styles.tableStyleNov}
        columnHeaderHeight={themeConfig.columnHeaderHeight}
        rowHeight={themeConfig.rowHeight}
        rows={ArticleLists || []}
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
            labelDisplayedRows: ({ from, to, count }) => t('pagination footer', { from, to, count })
          }
        }}
        apiRef={dataGridApiRef as React.MutableRefObject<GridApiCommunity>}
      />
    </Box>
  );

  const cardView = (
    <Grid container spacing={3} sx={{ mb: 2, padding: '15px' }}>
      {ArticleLists &&
        Array.isArray(ArticleLists) &&
        ArticleLists.map((item, index) => {
          return (
            <Grid key={index} item xs={6} sm={6} md={4} lg={12 / 5}>
              <ArticleCard data={item} onDeleteClick={handleOpenDeleteDialog} imageUrl={apiUrls.apiUrl_LMS_LMSArticleEndpoint} />
            </Grid>
          );
        })}
    </Grid>
  );

  return !isLoading ? (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, margin: 2 }}>
            <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode} aria-label='text alignment'>
              <ToggleButton value='grid' aria-label='left aligned'>
                <Icon icon='ic:baseline-view-list' />
              </ToggleButton>
              <ToggleButton value='card' aria-label='center aligned'>
                <Icon icon='ic:baseline-view-module' />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <TableHeader dataGridApi={dataGridApiRef} value={value} handleFilter={handleFilter} toggle={toggleAddArticleDrawer} />
          {renderViewBasedOnMode()}
        </Card>
      </Grid>

      {!isLoadingProfileUser && addArticleOpen && <AddArticleDrawer open={addArticleOpen} domain={profileUser?.domain} toggle={toggleAddArticleDrawer} />}

      <DeleteCommonDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} selectedRowId={selectedRowId} item='Article' onDelete={onDelete} />
    </Grid>
  ) : null;
};

export default ArticleList;
