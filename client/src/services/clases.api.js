import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/Clase2/"
});

export const getAllClases = () => {
    return api.get("/");
};

export const crearClase = (Clase) => {
    return api.post("/", Clase);
};

export const eliminarClase = (id) => {
    return api.delete(`/${id}/`);
};

export const actualizarClase = (id, datosActualizados) => {
    return api.put(`/${id}/`, datosActualizados);
};


