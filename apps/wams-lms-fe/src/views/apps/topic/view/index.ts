import toast from 'react-hot-toast'

import apiUrls from "template-shared/configs/apiUrl";
import {myFetch} from "template-shared/@core/utils/fetchWrapper";

export const fetchAllTopics = async () => {
    const response = await myFetch(apiUrls.apiUrl_LMS_LMSTopicEndpoint, {
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

export const addNewTopic = async (topic: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_LMS_LMSTopicWithImageEndpoint, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: topic
  });

  const createdItem = await response.json();
  toast.success('Topic added successfully');

  return createdItem;
};


export const getTopicDetail = async (id: number) => {
    const response = await myFetch(`${apiUrls.apiUrl_LMS_LMSTopicEndpoint}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    const data = await response.json()

    return data
}


export const deleteTopicById = async (id: number) => {
    await myFetch(`${apiUrls.apiUrl_LMS_LMSTopicEndpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

    toast.success('Topic delete successfully')

    return id
}

export const updateTopicById = async (topic: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_LMS_LMSTopicWithImageEndpoint, {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: topic
  })

  const editTopic = await response.json()
  toast.success('Topic edit successfully')

  return editTopic
}


// Function to fetch the top 6 topics
export const fetchTop6Topics = async () => {
  const response = await myFetch(apiUrls.apiUrl_LMS_LMSTopicTop6Endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
  const data = await response.json();

   return data;
};
