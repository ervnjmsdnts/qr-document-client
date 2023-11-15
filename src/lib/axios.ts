import axios from 'axios';

const request = axios.create({
  baseURL: 'https://qr-document-api.vercel.app/api',
  // baseURL: 'http://localhost:8080/api',
});

export default request;
