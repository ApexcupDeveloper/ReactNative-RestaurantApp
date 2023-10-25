import {useSelector} from 'react-redux';
import {API_BASE_URL} from '../../api/constant';
import {handleError} from '../../api/handleError';
import {SET_DATA_LOADING, SET_LOADING} from '../types';
import axios from 'axios';

const httpClient = token => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
  client.defaults.headers.common['Authorization'] = token
    ? `Bearer ${token}`
    : null;
  return client;
};

export const getVendors = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });

    httpClient(token)
      .post('/index', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const getProfileData = (dispatch, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .get('/get_user')
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const updateProfileData = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    fetch(API_BASE_URL + '/update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
      body: data,
    })
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res);
        }
      })
      .catch(err => {
        reject(handleError(err));
      });
    // HTTPS.post('/update_user', data, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //         "Authorization" : "Bearer " + token
    //     }
    // })
    //     .then((res) => {
    //         resolve(res.data);
    //     })
    //     .catch((err) => {
    //         reject(handleError(err))
    //     })
  });

export const startTransaction = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .post('/start_transaction', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const getTransaction = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .post('/vendor/get_transaction_details', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const getHistory = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .post('/get_transaction_history', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const checkAction = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .post('/check_action', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const updateNotiToken = (deviceToken, type, token) =>
  new Promise((resolve, reject) => {
    httpClient(token)
      .post('/update-phone-token', {
        phone_token: deviceToken,
        phone_type: type,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const getNotifications = (dispatch, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .post('/list_notification')
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const updateNotification = (dispatch, data, token) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_DATA_LOADING,
      payload: true,
    });
    httpClient(token)
      .post('/update_notification', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const addFavorite = (data, token) =>
  new Promise((resolve, reject) => {
    httpClient(token)
      .post('/add_to_favorites', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const removeFavorite = (data, token) =>
  new Promise((resolve, reject) => {
    httpClient(token)
      .post('/remove_from_favorites', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const getVendor = (data, token) =>
  new Promise((resolve, reject) => {
    httpClient(token)
      .post('/vendor_detail', data)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });
