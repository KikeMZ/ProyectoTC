import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "Profesor"
});

export const getAllProfesores = () => {
  return api.get('/');
}


export const createProfesor = (profesor) => {
  return api.post('/', profesor);
}

export const deleteProfesor = (id) => {
  return api.delete(`/${id}/`);
}


export const getProfesor = (id) => {
  return api.get(`/${id}/`);
}


export const updateProfesor = (id, profesor) => api.put(`/${id}/`, profesor);

