import React, { useState, useEffect, useContext } from 'react';
import MateriaCard from "../components/card"
import { getProfesorByCorreo } from "../services/profesor.api";
import { getClasesByProfesor, getClasesByProfesorCurrentPeriodo } from '../services/clases.api.js';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

import { NavContext } from "../layouts/layoutProfesor";
import { claseContext } from "../layouts/layoutProfesor";
import { profesorContext } from '../layouts/layoutProfesor';
import { useAtom } from "jotai";
import { alumnosAtom } from "./alumnos";
import { criteriosAtom } from "./criterios"


export default function HomeProfesor() {
  const [lista, setLista] = useState([]);
  const location = useLocation();
  const { dontshowNav } = useContext(NavContext); 
  const {limpiarDatos} = useContext(claseContext);
  const {dataProfesor} = useContext(profesorContext);
  const profesor = dataProfesor?.toUpperCase();

  const [ existenAlumnos, setExistenAlumnos ] = useAtom(alumnosAtom);
  const [ existenCriterios, setExistenCriterios ] = useAtom(criteriosAtom);


  useEffect(() => {
    async function cargarclases() {
      try {
        //const res = await getProfesorByCorreo(profesor);
        //console.log("Respuesta Sesions:")
        //console.log(res)
        let datosProfesor = jwtDecode(window.localStorage.getItem("access_token"));
        const resClases = await getClasesByProfesorCurrentPeriodo(await datosProfesor.nombre); // Obtener la respuesta de getClasesByProfesor
        const profesorMatches = resClases.data //res.data.filter(item => item.nombreProfesor === profesor); // Filtrar la lista directamente
        console.log(datosProfesor);
        setExistenAlumnos(false);
        setExistenCriterios(false); 
        setLista(profesorMatches); // Establecer la lista filtrada en el estado
      } catch (error) {
        console.error('Error al cargar las clases:', error);
      }
    }
  
    cargarclases(); // Llamar a la función cargarclases
    dontshowNav();
    limpiarDatos();
  }, []);
  
  return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {lista.map((clase, index) => (
            <MateriaCard key={index} clase={clase} />
          ))}
        </div>
 
  );
}

