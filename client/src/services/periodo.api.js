import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "Periodo"
});

export const getAllPeriodos = () => {
  return api.get('/');
}


export const createPeriodo = (periodo) => {
  return api.post('/', periodo);
}

export const deletePeriodo = (id) => {
  return api.delete(`/${id}/`);
}


export const getPeriodo = (id, periodo) => {
  return api.get(`/${id}/`, periodo);
}


export const updatePeriodo = (id, periodo) => api.put(`/${id}/`, periodo);

