import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

export const getToken = (administrador) => {
  return api.post('/token/', administrador)
}

