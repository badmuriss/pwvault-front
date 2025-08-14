import axios from 'axios';
import { environment } from '../../environments/environment';

const api = axios.create({
  baseURL: environment.PWVAULT_BACK_URI, 
  timeout: 5000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Token is now in httpOnly cookie, no need to manually set Authorization header
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/token-fail';
    }
    return Promise.reject(error);
  }
);

export default api;