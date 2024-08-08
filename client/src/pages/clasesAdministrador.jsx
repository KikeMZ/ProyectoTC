
import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { extraerDatosMaterias } from '../services/importacion.js';

import ModalExtraerClases from "../components/modalExtraerClases";
import ClaseCard from "../components/cardClase"
import { Button, useDisclosure } from "@nextui-org/react";
import {toast} from 'react-hot-toast';
import { getAllProfesores, createProfesor } from '../services/profesor.api.js';
import { getAllClases, getClasesByPeriodo, crearClase } from '../services/clases.api.js';
import axios from "axios";


export default function ClasesAdministrador() {

  const controlModal = useDisclosure();
  const navigate = useNavigate();

  const [archivoPDF, setArchivoPDF] = useState(null); 
  const [clases, setClases] = useState([]);
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);
  const [mostrarTarjetas, setMostrarTarjetas] = useState(false);
  const [lista, setLista] = useState([]);

  const id_periodo = new URLSearchParams(location.search).get('periodo');
  const nombre_periodo = new URLSearchParams(location.search).get('nombre');



  const mensajesImportacion = [
    "¡Se han importado los datos del PDF exitosamente!", // 0 sin problemas
    "¡El archivo PDF esta vacio!", // 1
    "¡La estructura del documento no es valida!", //2
    "¡El tipo de archivo no es valido!",//3 Solo PDF
    "¡Seleccione un archivo primero!"//4 Sin archivo
  ];

  useEffect(()=>{
    async function cargarclases(){
      const res =  await getClasesByPeriodo(id_periodo);
      if(res.data.length>0)
      {
       console.log(res);
       setLista(res.data);
       setMostrarTarjetas(true);
      }
       
    }
    cargarclases();
  },[]);


  const registrarProfesores = async (listaClases) => {
   //console.log("Profesores:")
   let respuesta = await getAllProfesores();
   let nombreProfesoresBD = respuesta.data.map( (profesor) => profesor.nombre )
   let nombreProfesores = listaClases.map( (clase) => clase.nombreProfesor); 
   //console.log(nombreProfesores);
   let auxProfesores = new Set(nombreProfesores);
   let listaProfesoresEncontrados = [...auxProfesores];
   //console.log(listaProfesoresEncontrados);
   let profesoresNoEncontrados = listaProfesoresEncontrados.filter( (profesor) => !nombreProfesoresBD.includes(profesor) );
   console.log(profesoresNoEncontrados)
   //let profesoresCreados = []
   let promesas = profesoresNoEncontrados.map( profesor => createProfesor({"nombre":profesor, "id_usuario":null}));
   await Promise.all(promesas).then( res => {console.log("Profesores creados")});

   //console.log(profesoresUnicos);
   
  }

  const obtenerDatosProfesores = async (listaClases) => {
   let respuesta = await getAllProfesores();
   let profesoresBD = respuesta.data;
   let profesoresExtraccion = [...new Set(listaClases.map( (clase) => clase.nombreProfesor))]; 
   let listaProfesores = profesoresBD.filter( (profesor) => profesoresExtraccion.includes(profesor.nombre) );
   return listaProfesores;
   

  }
  
  const registrarClases = async (listaClases, periodo) => {
   let profesores = await obtenerDatosProfesores(listaClases);
   let JSONClase = {
    "nrc":"",
    "clave":"",
    "seccion":"",
    "nombreMateria":"",
    "id_profesor":"",
    "id_periodo":""
   }
   for(let clase of listaClases)
   {
    let profesor = profesores.find( (profesor) => profesor.nombre==clase.nombreProfesor)
    JSONClase = {
     "nrc": clase.nrc,
     "clave": clase.clave,
     "seccion": clase.seccion,
     "nombreMateria": clase.nombreMateria,
     "id_profesor": profesor.id,
     "id_periodo": periodo
    }
    console.log( await crearClase(JSONClase) );
   }
  }

  const manejarArchivo = (e) => {
    let archivoSeleccionado = e.target.files[0];
    if (archivoSeleccionado) {
      let tipoArchivo = archivoSeleccionado.type;
      if (tipoArchivo === "application/pdf") { // Validar que sea un archivo PDF
        let leerArchivo = new FileReader();
        leerArchivo.readAsArrayBuffer(archivoSeleccionado);
        leerArchivo.onload = (e) => {
        setArchivoPDF(e.target.result);
        };
      } else { 
      toast.error("Por favor seleccione un archivo PDF");
      }
    }
  };

  const leerPDF = async () => {
    //e.preventDefault();
    const response = await extraerDatosMaterias(archivoPDF);
    if (response) {
      const { resultado, clases: listaClases } = response;
      let nuevaLista = [];
      let bandera = 0;
      for (let i = 0; i < listaClases.length; i++) {
        bandera=0;
        lista.map((clase, index)=>{
          if (clase.nrc == listaClases[i].nrc) {
            bandera = 1; 
          }
        })
        if (bandera == 0) {
          nuevaLista.push(listaClases[i])
        }
      }
      if(nuevaLista.length>0)
      {
       console.log(nuevaLista)
       setLista([...lista, ...nuevaLista]);
       await registrarProfesores(nuevaLista);
       console.log("Profesores registrados");
       await registrarClases(nuevaLista, id_periodo);
      }

    /*  for (let i = 0; i < nuevaLista.length; i++) {
        axios.post(import.meta.env.VITE_BACKEND_URL + "Clase2/", nuevaLista[i]).then( res => {
        console.log(res);
       });
      } */
      setResultadoExtraccion(resultado);
      setMostrarTarjetas(resultado === 0);
      


      if (resultado != 0) {
      toast.error(mensajesImportacion[resultado]);
        
      }else{
      toast.success(mensajesImportacion[resultado]);
      controlModal.onClose();
      }
    } else {
      toast.error('Selecciona un archivo primero');
    }
    
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-full">
      <div className="flex justify-start items-start w-full">
       <Button onClick={() =>{ navigate("/")}} startContent={<i className="pi pi-chevron-left"/>} className="font-semibold mb-4 ml-16" variant="faded">Regresar a periodos</Button>
      </div>
      {!mostrarTarjetas && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold mb-8">
            Parece que aún no tienes registrada ninguna clase para este periodo.
          </h1>
          <form className="mb-4">
            <input type="file" accept=".pdf" id="cargar" name="archivo" onChange={manejarArchivo} />
          </form>
          <Button
          radius="large"
          className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white mt-20"
          onClick={leerPDF}
        >
          Importar clases
        </Button>
        </div>
      )}

      {mostrarTarjetas && (
        <div className="flex flex-col">
        <h1 className="text-4xl font-semibold ">Clases - {nombre_periodo}</h1>
        <Button
          radius="large"
          className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white mt-10 text-base font-semibold"
          onClick={controlModal.onOpen}
        >
          Importar clases
        </Button>
        <h2 className="text-2xl font-semibold mt-3 ml-4">Total: {lista.length}</h2>


        <div className="grid grid-cols-3 gap-4 p-4 ">
          {lista.map((clase, index) => (
            <ClaseCard key={index} clase={clase} />
          ))}
        </div>
        </div>
      )}

      <ModalExtraerClases controlModal={controlModal} onManejarArchivo={manejarArchivo} extraerClases={leerPDF}/>
    </div>
    </>
  );
}

