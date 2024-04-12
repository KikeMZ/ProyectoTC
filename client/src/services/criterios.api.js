import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/Criterio"
});

export const getAllCriterios = () => {
    return api.get("/");
};

export const crearCriterio = (criterio) => {
    return api.post("/", criterio);
};

export const eliminarCriterio = (id) => {
    return api.delete(`/${id}/`);
};

export const getCriterio = (id) => {
    return api.get(`/${id}/`);
};




export const actualizarCriterio = (id, Criterios) => {
    return api.put(`/${id}/`, Criterios);
};