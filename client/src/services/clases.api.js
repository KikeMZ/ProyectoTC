import axios from 'axios';

const api = axios.create({
    baseURL: "http://150.230.40.105/api/v1/Clase2/"
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


