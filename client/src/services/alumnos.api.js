import axios from 'axios'


const clasApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/Alumno"
});

export const getAllAlumnos = () => {
  return clasApi.get('/').then(res => res.data);
}


export const createAlumno = (alumno) => {
  return clasApi.post('/', alumno);
}

export const deleteAlumno = (id) => {
  return clasApi.delete(`/${id}/`);
}


export const getAlumno = (id, alumno) => {
  return clasApi.get(`/${id}/`, alumno);
}


export const updateClase = (id, alumno) => clasApi.put(`/${id}/`, alumno);