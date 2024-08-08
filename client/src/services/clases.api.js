import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL + "Clase2/"
});

export const getAllClases = () => {
    return api.get("/");
};

export const getClasesByPeriodo = (periodo) => {
    return api.get(`getClasesByPeriodo/${periodo}/`); 
}

export const getClasesByProfesor = (profesor) => {
    return api.get("/getClasesByProfesor/?profesor="+profesor);
}

export const getClasesByProfesorCurrentPeriodo = (profesor) => {
    return api.get(`/getClasesByProfesorCurrentPeriodo/${profesor}/`);
}

export const getClasesByAlumno = (alumno) => {
    return api.get(`/getClasesByAlumno/${alumno}/`);
}

export const crearClase = (Clase) => {
    return api.post("/", Clase);
};

export const eliminarClase = (id) => {
    return api.delete(`/${id}/`);
};



export const actualizarClase = (id, datosActualizados) => {
    return api.put(`/${id}/`, datosActualizados);
};


