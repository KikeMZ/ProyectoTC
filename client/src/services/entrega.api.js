import axios from 'axios'


const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/Entrega"
  });

export const getAllEntregas = () => {
    return api.get('/');
}

export const createEntrega = (Entrega) => {
    return api.post('/',Entrega);
}

export const deleteEntrega = (id) => {
    return api.delete(`/${id}/`);
}


export const getEntrega = (id,Entrega) => {
    return api.get(`/${id}/`,Entrega);
}

export const updateEntrega = (id, Entrega) => api.patch(`/${id}/`,Entrega);