import toast from 'react-hot-toast'

import apiUrls from "template-shared/configs/apiUrl";
import {myFetch} from "template-shared/@core/utils/fetchWrapper";


export const fetchAllArticles = async () => {
    const response = await myFetch(apiUrls.apiUrl_LMS_LMSArticleEndpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    const data = await response.json()

    return data
}

export const addNewArticle = async (article: FormData) => {
  console.log("Sending FormData", article);

  const response = await myFetch(apiUrls.apiUrl_LMS_LMSArticleWithFileEndpoint, {
    method: 'POST',
    headers: {

      'Access-Control-Allow-Origin': '*'
    },
    body: article
  });

  if (!response.ok) {
    throw new Error(`Failed to add article: ${response.statusText}`);
  }

  const createdItem = await response.json();
  toast.success('Article added successfully');

  return createdItem;
};

export const getVisitedArticles = async (userId) => {
  try {
    const response = await myFetch(`${apiUrls.apiUrl_LMS_LMSArticleEndpoint}/visited/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch visited articles: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    toast.error("Error fetching visited articles");
    console.error("Fetch visited articles error:", error);

    return [];
  }
};


export const getArticleDetail = async (id: number) => {
    const response = await myFetch(`${apiUrls.apiUrl_LMS_LMSArticleEndpoint}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    const data = await response.json()

    return data
}

export const deleteArticleById = async (id: number) => {
    await myFetch(`${apiUrls.apiUrl_LMS_LMSArticleEndpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

    toast.success('Article delete successfully')

    return id
}

export const updateArticleById = async (articleId, article) => {
  const response = await myFetch(`${apiUrls.apiUrl_LMS_LMSArticleEndpoint}/${articleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error: ${response.status} - ${errorData.message}`);
  }

  const editArticle = await response.json();
  toast.success('Article edited successfully');

  return editArticle;
};


export const updateArticleFileById = async (articleId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await myFetch(`${apiUrls.apiUrl_LMS_LMSArticleWithFileEndpoint}/${articleId}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Error: ${response.status} - ${errorData.message}`);
  }

  const updatedFile = await response.json();
  toast.success('File updated successfully');

  return updatedFile;
};


export const downloadArticleFile = async (originalFileName: string) => {
  const response = await myFetch(
    `${apiUrls.apiUrl_LMS_LMSArticleFileDownloadEndpoint}?domain=novobit.eu&filename=${encodeURIComponent(
      originalFileName
    )}&version=1`
  );

   if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = originalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } else {
    console.error('Failed to download the file:', response.statusText);
  }
};




