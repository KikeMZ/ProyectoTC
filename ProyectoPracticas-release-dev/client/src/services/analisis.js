import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "entregas/tipos"
});

export const getEntregasTipos = (id) => {
  return api.get(`/${id}/`);
}

