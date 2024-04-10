import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/Criterios"
});

export const getAllCriterios = () => {
    return api.get("/");
};

export const crearCriterio = (Criterios) => {
    return api.post("/", Criterios);
};

export const eliminarCriterio = (id) => {
    return api.delete(`/${id}/`);
};

export const getCriterio = (id,Criterios) => {
    return clasApi.get(`/${id}/`,Criterios);
};


export const actualizarCriterio = (id, Criterios) => {
    return api.put(`/${id}/`, Criterios);
};