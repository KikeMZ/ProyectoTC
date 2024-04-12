import axios from 'axios'


const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/ClaseCriterio"
});

export const getAllClaseCriterio = () => {
  return api.get('/').then(res => res.data);
}


export const createClaseCriterio = (criterio) => {
  return api.post('/', criterio);
}

export const deleteClaseCriterio = (id) => {
  return api.delete(`/${id}/`);
}


export const getClaseCriterio = (id) => {
  return api.get(`/${id}/`);
}

export const getCriteriosByNRC = (nrc) => {
  return api.get('/?search='+nrc);
};


export const updateClaseCriterio = (id, criterio) => api.patch(`/${id}/`, criterio );