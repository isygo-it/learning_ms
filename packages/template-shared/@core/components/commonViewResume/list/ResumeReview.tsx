import React, {useState} from 'react'
import {Document, Page, pdfjs} from 'react-pdf'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Icon from 'template-shared/@core/components/icon'
import CardActions from '@mui/material/CardActions'
import {useTranslation} from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

interface CardItem {
    fileName: string
    fileUrl: string
}

const ResumePreview = (props: CardItem) => {
    const {fileName, fileUrl} = props
    console.log(fileName)
    const [pdfPageWidth, setPdfPageWidth] = useState<number>(0)

    const {t} = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const [numPages, setNumPages] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [pageWidth, setPageWidth] = useState(pdfPageWidth)

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

    // const fileUrl = `${apiUrls.rpmResumeFileDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(fileName)}&version=1`
    pdfjs.getDocument(fileUrl).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            const viewport = page.getViewport({scale: 1})
            const width = viewport.width
            setPdfPageWidth(width)
        })
    })

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const goToNextPage = () => {
        if (currentPage < numPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= numPages) {
            setCurrentPage(pageNumber)
        }
    }

    const handleZoomIn = () => {
        if (zoom < 2) {
            setZoom(zoom + 0.2)
            updatePageWidth()
        }
    }

    const handleZoomOut = () => {
        if (zoom > 0.2) {
            setZoom(zoom - 0.2)
            updatePageWidth()
        }
    }

    const updatePageWidth = () => {
        const newWidth = pageWidth * zoom
        setPageWidth(newWidth)
    }

    return (
        <Grid>
            <Box>
                <Card sx={{padding: '0px', boxShadow: 'none !important'}}>
                    <CardContent sx={{padding: '0px'}}>
                        <Paper className='documentPdfView'>
                            <Paper sx={{display: 'flex', overflowX: 'scroll'}} className='scrollDocumentPdfView'>
                                <Document file={fileUrl} onLoadSuccess={({numPages}) => setNumPages(numPages)}>
                                    <Page pageNumber={currentPage} scale={zoom}/>
                                </Document>
                            </Paper>
                        </Paper>
                    </CardContent>

                    <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
                        <IconButton onClick={goToPreviousPage} disabled={currentPage === 1} size={'medium'}>
                            <Icon icon='mdi:page-previous'/>
                        </IconButton>
                        <span style={{margin: '0 10px'}}>
              {t('Page')} {currentPage} {t('of')} {numPages}
            </span>
                        <IconButton onClick={goToNextPage} disabled={currentPage === numPages} size={'medium'}>
                            <Icon icon='mdi:page-next'/>
                        </IconButton>
                        <input
                            type='number'
                            value={currentPage}
                            onChange={e => goToPage(parseInt(e.target.value))}
                            min={1}
                            max={numPages}
                        />
                        <IconButton onClick={handleZoomIn} size={'medium'}>
                            <Icon icon='mdi:magnify-plus'/>
                        </IconButton>
                        <IconButton onClick={handleZoomOut} size={'medium'}>
                            <Icon icon='mdi:magnify-minus'/>
                        </IconButton>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}

export default ResumePreview
