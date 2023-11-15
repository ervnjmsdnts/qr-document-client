import axios from 'axios';

const request = axios.create({
  baseURL: 'https://qr-document-api.vercel.app/api',
});

export default request;
