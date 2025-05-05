import React, { useState, useEffect, useContext } from 'react';
import ClaseAlumnoCard from "../components/cardClaseAlumnos";
import { getProfesorByCorreo } from "../services/profesor.api";
import { getClasesByAlumno } from '../services/clases.api.js';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { FaChalkboardTeacher } from "react-icons/fa";

import { NavContext } from "../layouts/layoutAlumno";
import { claseContext } from "../layouts/layoutAlumno";
//import { profesorContext } from '../layouts/layoutProfesor';
//import { useAtom } from "jotai";
//import { alumnosAtom } from "./alumnos";
//import { criteriosAtom } from "./criterios"


export default function HomeAlumno() {
  const [lista, setLista] = useState([]);
  const location = useLocation();
  const { dontshowNav } = useContext(NavContext); 
  const {limpiarDatos} = useContext(claseContext);
  //const {dataProfesor} = useContext(profesorContext);
  //const profesor = dataProfesor?.toUpperCase();

  //const [ existenAlumnos, setExistenAlumnos ] = useAtom(alumnosAtom);
  //const [ existenCriterios, setExistenCriterios ] = useAtom(criteriosAtom);


  useEffect(() => {
    async function cargarclases() {
      try {
        //const res = await getProfesorByCorreo(profesor);
        //console.log("Respuesta Sesions:")
        //console.log(res)
        let datosAlumno = jwtDecode(window.localStorage.getItem("access_token"));
        const resClases = await getClasesByAlumno(datosAlumno.matricula); // Obtener la respuesta de getClasesByAlumno
        const clasesAlumno = resClases.data //res.data.filter(item => item.nombreProfesor === profesor); // Filtrar la lista directamente
        console.log(resClases);
        //setExistenAlumnos(false);
        //setExistenCriterios(false); 
        setLista(clasesAlumno); // Establecer la lista filtrada en el estado
      } catch (error) {
        console.error('Error al cargar las clases:', error);
      }
    }
  
    cargarclases(); // Llamar a la función cargarclases
    dontshowNav();
    limpiarDatos();
  }, []);
  
  return (
        <>
         <div className="flex mt-2 ml-5 mb-4">
         <FaChalkboardTeacher className="mt-3" size="45px"/>
          <h1 className="text-4xl font-semibold mt-3 mb-2 ml-5">Clases</h1>
         </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 ">
          
          {lista.map((clase, index) => (
            <ClaseAlumnoCard key={index} clase={clase} />
          ))}
        </div>
        </>
  );
}

