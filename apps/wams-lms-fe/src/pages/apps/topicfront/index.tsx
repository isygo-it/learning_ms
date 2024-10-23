import React, { useState } from "react";
import { useQuery } from "react-query";
import { Paper, Grid, Typography, TextField, CircularProgress, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from 'next/router';
import { fetchAllTopics } from "../../../views/apps/topic/view";
import apiUrls from "template-shared/configs/apiUrl";

const TopicFront = () => {
  const router = useRouter();
  const { data: topics, isLoading } = useQuery("topics", fetchAllTopics);
  const [searchTerm, setSearchTerm] = useState("");

  const handleView = (topicId) => {
    router.push(`/apps/articlefront?topicId=${topicId}`);
  };

  const filteredTopics = topics?.filter((topic) =>
    topic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: "20px" }}>
      <Paper elevation={3} sx={{ padding: "15px", marginBottom: "30px", textAlign: "center", maxWidth: "600px", marginX: "auto" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search for a course"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#888" }} />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {isLoading ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        ) : filteredTopics?.length > 0 ? (
          filteredTopics.map((topic) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={topic.id} onClick={() => handleView(topic.id)}>
              <Paper
                elevation={3}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    "& .topic-title": {
                      color: "red",
                    },
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                  <Box
                    component="img"
                    src={
                      topic.imagePath
                        ? `${apiUrls.apiUrl_LMS_LMSTopicImageDownloadEndpoint}/${topic.id}?${Date.now()}`
                        : "default-image-url"
                    }
                    alt={topic.name}
                    sx={{ height: "60px", width: "60px", borderRadius: "6px", mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="black"
                    align="center"
                    className="topic-title"
                    sx={{
                      transition: "color 0.2s ease-in-out",
                    }}
                  >
                    {topic.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No topics found
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TopicFront;
