import axios from 'axios'


const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/Alumno"
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

