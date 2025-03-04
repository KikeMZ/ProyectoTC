import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 6000,
    headers: {
        Authorization: localStorage.getItem('access_token')
        ? 'JWT '+ localStorage.getItem('access_token') : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    }

});