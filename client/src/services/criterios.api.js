import axios from 'axios';

const api = axios.create({
    baseURL: "http://150.230.40.105/api/v1/Criterio"
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