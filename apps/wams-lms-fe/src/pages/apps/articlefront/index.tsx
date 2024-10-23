import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Paper, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, TextField, IconButton } from "@mui/material";
import { StarBorder, Info as InfoIcon, PictureAsPdf, Language, Movie, ArticleOutlined } from "@mui/icons-material";
import { useQuery } from "react-query";
import FileViewer from "../../../views/apps/article/view/FileViewer";
import {downloadArticleFile, fetchAllArticles, getVisitedArticles} from "../../../views/apps/article/view";
import { getTopicDetail } from "../../../views/apps/topic/view";
import apiUrls from "template-shared/configs/apiUrl";
import { myFetch } from "template-shared/@core/utils/fetchWrapper";
import { useAuth } from "template-shared/hooks/useAuth";
import Icon from "template-shared/@core/components/icon";
import Tooltip from "@mui/material/Tooltip";

const ArticleFront = () => {
  const auth = useAuth();
  const router = useRouter();
  const { topicId } = router.query;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [topic, setTopic] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visitedArticles, setVisitedArticles] = useState<number[]>([]);
  const { data: articles, isLoading, isError } = useQuery('articles', fetchAllArticles);

  useEffect(() => {
    if (topicId) {
      const id = parseInt(topicId as string, 10);
      if (!isNaN(id)) {
        getTopicDetail(id).then(setTopic).catch(console.error);
      }
    }

    getVisitedArticles(auth.user.id).then(setVisitedArticles).catch(console.error);
  }, [topicId]);

  const handleListItemClick = async (event, index, article) => {
    const fileUrl = `${apiUrls.apiUrl_LMS_LMSArticleFileDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(article.originalFileName)}&version=1`;
    setSelectedIndex(index);
    setSelectedArticle({
      ...article,
      fileUrl: fileUrl,
      fileExtension: article.type,
    });

    await myFetch(`${apiUrls.apiUrl_LMS_LMSArticleVisitUserEndpoint}/${auth.user.id}/${article.id}`, { method: 'POST' });
    setVisitedArticles(prev => {
      const updatedArticles = [...prev, article.id];

      return updatedArticles.filter((id, index) => updatedArticles.indexOf(id) === index);
    });
  };


  const handleDownload = async () => {
    if (selectedArticle.originalFileName) {
      await downloadArticleFile(selectedArticle.originalFileName);
    }
  };

  const handleIconClick = (event, article) => {
    event.stopPropagation();
    setDialogContent(article);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const renderFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
      case "html":
        return <Language sx={{ color: '#1976d2' }} />;
      case "video":
        return <Movie sx={{ color: '#388e3c' }} />;
      default:
        return <StarBorder />;
    }
  };


  // Filter articles by topic
  const topicFilteredArticles = articles ? articles.filter(article => {
    return article.topics && article.topics.some(topic => topic.id === parseInt(topicId as string, 10));
  }) : [];

  // Further filter the topic-filtered articles by search term
  const filteredArticles = topicFilteredArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', padding: '40px 20px' }}>
      <Typography variant="h6" sx={{ color: '#9e9e9e' }}>
        No articles found for this topic.
      </Typography>
      <Typography variant="body2" sx={{ color: '#bdbdbd', marginTop: '10px' }}>
        Try searching with a different keyword or come back later.
      </Typography>
      <Button variant="contained" color="primary" sx={{ marginTop: '20px' }} onClick={() => router.back()}>
        Go Back
      </Button>
    </Box>
  );

  const renderSelectPrompt = () => (
    <Box sx={{ textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#616161' }}>
      <ArticleOutlined sx={{ fontSize: 100, color: '#bdbdbd', marginBottom: '20px' }} />
      <Typography variant="h5" sx={{ fontWeight: '500', color: '#424242' }}>
        Select an Article
      </Typography>
      <Typography variant="body2" sx={{ color: '#757575', marginTop: '10px' }}>
        Choose an article from the list on the left to view its content here.
      </Typography>
    </Box>
  );

  const sidebar = (
    <Box sx={{ padding: '16px', bgcolor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {topic ? (
          <>
            <img
              src={topic.imagePath ? `${apiUrls.apiUrl_LMS_LMSTopicImageDownloadEndpoint}/${topic.id}?${Date.now()}` : "default-image-url"}
              alt={topic.name || "Topic Image"}
              style={{ width: '100px', height: '100px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            />
            <Typography variant="h6" sx={{ mt: 1, fontWeight: '600', color: '#424242' }}>{topic.name}</Typography>
          </>
        ) : (
          <span>Loading topic...</span>
        )}
      </Box>
      {topicFilteredArticles.length > 0 && (
        <TextField
          label="Search by title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: '30px', '&:hover fieldset': { borderColor: '#1976d2' } },
            '& label': { fontSize: '14px' }
          }}
        />
      )}
      <List component="nav" aria-label="articles per category" sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', padding: 0 }}>
        {isLoading ? (
          <ListItemText primary="Loading articles..." sx={{ textAlign: 'center', color: '#9e9e9e', padding: '20px 0' }} />
        ) : isError ? (
          <ListItemText primary="Error loading articles" sx={{ textAlign: 'center', color: '#d32f2f', padding: '20px 0' }} />
        ) : topicFilteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <ListItemButton
              key={article.id}
              sx={{
                borderRadius: '8px',
                margin: '5px 0',
                backgroundColor: visitedArticles.includes(article.id) ? '#E6E6FA' : 'transparent',
                '&:hover': { backgroundColor: '#e3f2fd' }
              }}
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index, article)}
            >
              <ListItemIcon>{renderFileIcon(article.type.toLowerCase())}</ListItemIcon>
              <ListItemText primary={article.title} sx={{ color: '#616161' }} />
              <ListItemIcon onClick={(event) => handleIconClick(event, article)} sx={{ color: '#616161' }}>
                <InfoIcon />
              </ListItemIcon>
            </ListItemButton>
          ))
        ) : renderEmptyState()}
      </List>
    </Box>
  );

  return (
    <Box className="flex gap-4 h-full">
      <Paper elevation={3} sx={{ maxWidth: "20rem", maxHeight: "calc(100vh - 50px)", overflow: "auto" }}>{sidebar}</Paper>
      <Paper elevation={3} sx={{ flex: 1, maxHeight: "calc(100vh - 50px)", overflowY: "auto" }}>
        {selectedArticle ? (
          <Box sx={{ padding: '24px', bgcolor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" sx={{ fontWeight: '600', color: '#424242', textAlign: 'center', mb: 2 }}>{selectedArticle.title}
              <Tooltip title={`Download File :  ${selectedArticle.title}`}>
              <IconButton
              color="primary"
              onClick={handleDownload}
              disabled={!selectedArticle.originalFileName}
            >
              <Icon icon="tabler:download"  />
            </IconButton>
              </Tooltip>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="body1"
              sx={{ color: '#757575', textAlign: 'center', mb: 2 }}
            >

              {selectedArticle.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FileViewer fileUrl={selectedArticle.fileUrl} fileExtension={selectedArticle.fileExtension} />
          </Box>
        ) : (
          topicFilteredArticles.length > 0 ? renderSelectPrompt() : renderEmptyState()
        )}
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogContent?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>Description: {dialogContent?.description}</DialogContentText>
          <DialogContentText>Author: {dialogContent?.author?.firstname} {dialogContent?.author?.lastname}</DialogContentText>
          <DialogContentText>Type: {dialogContent?.type}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArticleFront;
