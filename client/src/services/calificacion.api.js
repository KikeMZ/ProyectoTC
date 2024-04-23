import axios from 'axios'


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "Calificacion"
  });

export const getAllCalificaciones = () => {
    return api.get('/');
}

export const createCalificacion = (entrega) => {
    return api.post('/', entrega);
}

export const deleteCalificacion = (id) => {
    return api.delete(`/${id}/`);
}


export const getCalificacion = (id, entrega) => {
    return api.get(`/${id}/`, entrega);
}

export const updateCalificacion = (id, entrega) => api.patch(`/${id}/`,entrega);