import toast from 'react-hot-toast'

import apiUrls from "template-shared/configs/apiUrl";
import {myFetch} from "template-shared/@core/utils/fetchWrapper";

export const fetchAllAuthors = async () => {
    const response = await myFetch(apiUrls.apiUrl_LMS_LMSAuthorEndpoint, {
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


export const addNewAuthor = async (author: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_LMS_LMSAuthorWithImageEndpoint, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: author
  });

  const createdItem = await response.json();
  toast.success('Author added successfully');

  return createdItem;
};


export const getAuthorDetail = async (id: number) => {
    const response = await myFetch(`${apiUrls.apiUrl_LMS_LMSAuthorEndpoint}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    const data = await response.json()

    return data
}


export const deleteAuthorById = async (id: number) => {
    await myFetch(`${apiUrls.apiUrl_LMS_LMSAuthorEndpoint}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

    toast.success('Author delete successfully')

    return id
}

export const updateAuthorById = async (author: FormData) => {
  const response = await myFetch(apiUrls.apiUrl_LMS_LMSAuthorWithImageEndpoint, {
    method: 'PUT',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: author
  })

  const editAuthor = await response.json()
  toast.success('Author edit successfully')

  return editAuthor
}
