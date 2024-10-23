import React, {useState} from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {DataGrid, GridApi, GridColDef, GridColumnVisibilityModel} from '@mui/x-data-grid'
import Icon from '../icon'
import {JobOfferType} from '../../../types/apps/jobOfferTypes'
import Typography from '@mui/material/Typography'
import AddJobDrawer from '../../../views/apps/job/AddJobDrawer'
import {useTranslation} from 'react-i18next'
import JobTypeCard from '../../../views/apps/job/JobTypeCard'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import {useTheme} from '@mui/system'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {deletejob, fetchAll} from '../../api/job'
import DeleteCommonDialog from '../DeleteCommonDialog'
import {fetchAlljobTemplates} from '../../api/job-template'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import WebOutlinedIcon from '@mui/icons-material/WebOutlined'
import TemplateJobDrawer from '../../../views/apps/job/components/JobTemplateDrawer'
import GenerateDetail from '../../../views/apps/job/GenerateDetail'
import TableHeader from 'template-shared/views/table/TableHeader'
import toast from 'react-hot-toast'
import {format} from 'date-fns'
import Moment from 'react-moment'
import themeConfig from "../../../configs/themeConfig";
import Styles from "template-shared/style/style.module.css"
import {PermissionAction, PermissionApplication, PermissionPage} from "../../../types/apps/authRequestTypes";
import {checkPermission} from "../../api/decodedPermission";
import JobStatisticsContainer from "./statistics/JobstatisticsContainer";
import {fetchProfileFullData} from "../../api/account";

interface CellType {
    row: JobOfferType
}

const CommonJobList = () => {
    const queryClient = useQueryClient()
    const {t} = useTranslation()
    const [value, setValue] = useState<string>('')
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
    const [addJobOpen, setAddJobOpen] = useState<boolean>(false)

    const [editedDataJobb, setEditDataJobb] = useState<JobOfferType>()
    const [dialogSetTemplate, setDialogSetTemplate] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<number | null>(null)
    const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>([])

    const [selectedRowId, setSelectedRowId] = useState<number>(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const {data: jobs, isLoading} = useQuery(`jobs`, () => fetchAll())
    const {data: template, isLoading: isLoadingTemplate} = useQuery(`jobTemplates`, () => fetchAlljobTemplates())
    const [showGeneratePPF, setShowGeneratePPF] = useState<boolean>(false)
    const [idJobDetail, setIdJobDetail] = useState<number>(null)

    const toggleAddJobDrawer = () => setAddJobOpen(!addJobOpen)

    const handlePrint = (id: number) => {
        console.log('first click id', id)
        setShowGeneratePPF(true)
        setIdJobDetail(id)
        console.log('idJobDetail', idJobDetail)
    }

    const handleSetTemplate = (job: JobOfferType) => {
        console.log(job)
        setEditDataJobb(job)
        setDialogSetTemplate(true)
    }

    const jobMutationDelete = useMutation({
        mutationFn: (id: number) => deletejob(id),
        onSuccess: (id: number) => {
            toast.success(t('Job.Job_deleted_successfully'))
            if (id) {
                setDeleteDialogOpen(false)
                const updatedItems = ((queryClient.getQueryData('jobs') as any[]) || []).filter(item => item.id !== id)
                queryClient.setQueryData('jobs', updatedItems)
            }
        }
    })

    function onDelete(id: number) {
        jobMutationDelete.mutate(id)
    }

    const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>, row: JobOfferType) => {
        const newAnchorEls = [...anchorEls]
        newAnchorEls[row.id] = event.currentTarget
        setAnchorEls(newAnchorEls)
        setMenuOpen(row.id)
        setEditDataJobb(row)
    }

    const handleRowOptionsClose = () => {
        const newAnchorEls = [...anchorEls]
        newAnchorEls[selectedRowId] = null
        setAnchorEls(newAnchorEls)
        setMenuOpen(null)
    }

    function isTemplate(code: string): boolean {
        if (!Array.isArray(template) || template.length === 0) {
            return false
        }
        const foundObject = template.find(item => item.jobOffer && item.jobOffer.code === code)
        if (foundObject) {
            return true
        } else {
            return false
        }
    }
    const {data: profileUser, isLoading: isLoadingProfileUser} = useQuery('profileUser', fetchProfileFullData)
    const handleOpenDeleteDialog = (rowId: number) => {
        console.log(rowId)
        setDeleteDialogOpen(true), setSelectedRowId(rowId)
    }

    const router = useRouter()
    const handleViewIconClick = (row: JobOfferType) => {
        router.push(`/apps/job/view/${row.id}`)
    }

    const handleFilter = (val: string) => {
        setValue(val)
    }

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

    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>({
        createDate: false,
        createdBy: false,
        updateDate: false,
        updatedBy: false
    })

    const defaultColumns: GridColDef[] = [
        /*Domain column*/
        {
            flex: 0.1,
            field: 'domain',
            minWidth: 100,
            headerName: t('Domain.Domain') as string,
            renderCell: ({row}: CellType) => (
                <>
                    <Typography sx={{color: 'text.secondary'}}>{row.domain}</Typography>
                    {isTemplate(row.domain) ? (
                        <Badge badgeContent={'T'} color='primary'
                               sx={{ml: 4, verticalAlign: 'top', horizontalAlign: 'right'}}/>
                    ) : null}
                </>
            )
        },

        /*Code column*/
        {
            flex: 0.1,
            field: 'code',
            minWidth: 100,
            headerName: t('Code') as string,
            renderCell: ({row}: CellType) => (
                <>
                    <Typography sx={{color: 'text.secondary'}}>{row.code}</Typography>
                    {isTemplate(row.code) ? (
                        <Badge badgeContent={'T'} color='primary'
                               sx={{ml: 4, verticalAlign: 'top', horizontalAlign: 'right'}}/>
                    ) : null}
                </>
            )
        },

        /*Title column*/
        {
            flex: 0.1,
            field: 'title',
            minWidth: 100,
            headerName: t('Job.Job_Title') as string,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.title}</Typography>
        },

        /*Customer column*/
        {
            flex: 0.1,
            field: 'customer',
            minWidth: 100,
            headerName: t('Job.Customer') as string,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.customer}</Typography>
        },

        /*Owner column*/
        {
            flex: 0.1,
            field: 'owner',
            minWidth: 100,
            headerName: t('Job.Owner') as string,
            renderCell: ({row}: CellType) => <Typography sx={{color: 'text.secondary'}}>{row.owner}</Typography>
        },

        /*DeadLine column*/
        {
            flex: 0.1,
            field: 'deadline',
            minWidth: 100,
            headerName: t('Job.Deadline') as string,
            renderCell: ({row}: CellType) => (
                <Typography sx={{color: 'text.secondary'}}>
                    {row.details?.jobInfo?.deadline && format(new Date(row.details?.jobInfo?.deadline), 'dd/MM/yyyy')}
                </Typography>
            )
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

    const dataGridApiRef = React.useRef<GridApi>()
    const columns: GridColDef[] = [
        ...defaultColumns,
        {
            flex: 0.1,
            minWidth: 140,
            sortable: false,
            field: 'actions',
            headerName: '' as string,
            align: 'right',
            renderCell: ({row}: CellType) => (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.DELETE) &&
                    <Tooltip title={t('Action.Delete') as string}>
                        <IconButton onClick={() => handleOpenDeleteDialog(row.id)}
                                    className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                            <Icon icon='tabler:trash'/>
                        </IconButton>
                    </Tooltip>}

                    <Tooltip title={t('Action.Edit')}>
                        <IconButton
                            className={Styles.sizeIcon}
                            component={Link}
                            sx={{color: 'text.secondary'}}
                            href={`/apps/job/view/${row.id}`}
                        >
                            <Icon icon='fluent:slide-text-edit-24-regular'/>
                        </IconButton>
                    </Tooltip>
                    {isTemplate(row.code) ? (
                        checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.WRITE) &&
                        <Tooltip
                            title={t('Action.View') as string}
                            onClick={() => {
                                handlePrint(row.id)
                            }}
                        >
                            <IconButton
                                className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                <Icon icon='fluent:eye-lines-48-filled'/>
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    {!isTemplate(row.code) ? (
                        <IconButton
                            aria-controls={`menu-actions-${row.id}`}
                            aria-haspopup='true'
                            onClick={event => handleRowOptionsClick(event, row)}

                            className={Styles.sizeIcon}
                            sx={{color: 'text.secondary'}}
                        >
                            <Icon icon='tabler:dots-vertical'/>
                        </IconButton>
                    ) : null}

                    {checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.WRITE) &&
                    <Menu
                        className={Styles.sizeListItem}
                        key={`menu-actions-${row.id}`}
                        anchorEl={anchorEls[row.id]}
                        open={row.id === menuOpen}
                        onClose={handleRowOptionsClose}
                    >
                        <MenuItem
                            onClick={() => {
                                handleSetTemplate(row)
                            }}
                        >
                            <Tooltip title={t('Mark as Template') as string}>
                                <IconButton
                                    className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                    <WebOutlinedIcon/>
                                </IconButton>
                            </Tooltip>
                            {t('Mark as Template') as string}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handlePrint(row.id)
                            }}
                        >
                            <Tooltip title={t('Action.View') as string}>
                                <IconButton
                                    className={Styles.sizeIcon} sx={{color: 'text.secondary'}}>
                                    <Icon icon='fluent:eye-lines-48-filled'/>
                                </IconButton>
                            </Tooltip>
                            {t('Action.View') as string}
                        </MenuItem>
                    </Menu>}
                </Box>
            )
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
                rows={jobs || []}
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
                apiRef={dataGridApiRef}
            />
        </Box>
    )
    const cardView = (
        <Grid container spacing={3} sx={{padding: '15px'}}>
            {jobs &&
            Array.isArray(jobs) &&
            jobs.map((item, index) => {
                return (
                    <Grid key={index} item xs={12} md={6} lg={4}>
                        <JobTypeCard data={item}
                                     onDeleteClick={handleOpenDeleteDialog}
                                     onViewClick={handleViewIconClick}
                                     isTemplate={isTemplate}
                                     handlePrint={handlePrint}
                                     handleRowOptionsClick={handleRowOptionsClick}
                                     anchorEls={anchorEls}
                                     menuOpen={menuOpen}
                                     handleRowOptionsClose={handleRowOptionsClose}
                                     handleSetTemplate={handleSetTemplate}

                        />
                    </Grid>
                )
            })}
        </Grid>
    )

    return !isLoading && !isLoadingTemplate ? (
        <>
            <JobStatisticsContainer />
            <Grid container>
            <Grid item md={12}>
                <Card>
                    <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, margin: 2}}>
                        <ToggleButtonGroup exclusive value={viewMode} onChange={toggleViewMode}
                                           aria-label='text alignment'>
                            <ToggleButton value='grid' aria-label='left aligned'>
                                <Icon icon='ic:baseline-view-list'/>
                            </ToggleButton>
                            <ToggleButton value='card' aria-label='center aligned'>
                                <Icon icon='ic:baseline-view-module'/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <TableHeader
                        value={value}
                        handleFilter={handleFilter}
                        toggle={toggleAddJobDrawer}
                        dataGridApi={dataGridApiRef}
                        permissionApplication={PermissionApplication.PRM}
                        permissionPage={PermissionPage.JOB}
                        permissionAction={PermissionAction.WRITE}
                    />
                    {checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.READ) && renderViewBasedOnMode()}

                    {!isLoadingProfileUser && checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.WRITE) &&
                        (<AddJobDrawer open={addJobOpen} toggle={toggleAddJobDrawer} domain={profileUser?.domain}/>)}

                    {checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.DELETE) &&
                    <DeleteCommonDialog
                        open={deleteDialogOpen}
                        setOpen={setDeleteDialogOpen}
                        selectedRowId={selectedRowId}
                        item='Job'
                        onDelete={onDelete}
                    />}
                    {dialogSetTemplate && checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.WRITE) && (
                        <TemplateJobDrawer
                            open={dialogSetTemplate}
                            setOpen={setDialogSetTemplate}
                            job={editedDataJobb}
                            handleRowOptionsClose={handleRowOptionsClose}
                        />
                    )}

                    {showGeneratePPF && checkPermission(PermissionApplication.PRM, PermissionPage.JOB, PermissionAction.WRITE) &&
                    <GenerateDetail open={showGeneratePPF} setOpen={setShowGeneratePPF} id={idJobDetail}/>}

                </Card>
            </Grid>
        </Grid>
        </>
    ) : null
}

export default CommonJobList
