import axios from 'axios'


const clasApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/Entrega"
  });

export const getAllEntregas = () => {
    return clasApi.get('/');
}

export const createEntrega = (Entrega) => {
    return clasApi.post('/',Entrega);
}

export const deleteEntrega = (id) => {
    return clasApi.delete(`/${id}/`);
}


export const getEntrega = (id,Entrega) => {
    return clasApi.get(`/${id}/`,Entrega);
}

export const updateEntrega = (id, Entrega) => clasApi.put(`/${id}/`,Entrega);