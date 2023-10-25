import axios from 'axios';
import {API_BASE_URL} from './constant';

export const HTTPS = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
});
