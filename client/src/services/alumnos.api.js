import axios from 'axios'


const api = axios.create({
  baseURL: "http://150.230.40.105/api/v1/Alumno"
});

export const getAllAlumnos = () => {
  return api.get('/').then(res => res.data);
}


export const createAlumno = (alumno) => {
  return api.post('/', alumno);
}

export const deleteAlumno = (id) => {
  return api.delete(`/${id}/`);
}


export const getAlumno = (id, alumno) => {
  return api.get(`/${id}/`, alumno);
}


export const updateClase = (id, alumno) => api.put(`/${id}/`, alumno);

