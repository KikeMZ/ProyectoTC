import React, { useContext, useState,  useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import { claseContext } from "../layouts/layoutProfesor";
import Calificaciones from "./calificaciones"
import ModalEntregas from "../components/modalEntregas";
import ModalImportarEntrega from "../components/modalImportarEntrega";
import { obtenerListaAlumnos } from "../services/inscripcion.api";
import { getCalificacionesByNRC } from "../services/calificacion.api"
import { manejarArchivo, leerArchivoEntrega } from "../services/importacion"
import { getEntregasByNRC } from "../services/entrega.api"
import { getCriteriosByNRC } from "../services/claseCriterio.api";



import { Input, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import toast from 'react-hot-toast';
import { FiEdit2 } from 'react-icons/fi';
import { GrNext } from "react-icons/gr";




const RegistroCalificaciones = () => {

  const { showNav, shownav } = useContext(NavContext);
  const { dataClase } = useContext(claseContext);
  const controlModal = useDisclosure();
  const controlModalImportacion = useDisclosure();
  
  const [ archivoEntrega, setArchivoEntrega ] = useState(null);
  const [ alumnos, setAlumnos ] = useState([]);
  const [ entregas, setEntregas ] = useState([]);
  const [ criterios, setCriterios ] = useState([]);
  const [ calificaciones, setCalificaciones ] = useState([])
  const [ camposTabla, setCamposTabla ] = useState([])

  const [ entregaExtraida, setEntregaExtraida ] = useState(null)
  const [ entregaSeleccionada, setEntregaSeleccionada ] = useState(null);
  const [ calificacionesExtraidas, setCalificacionesExtraidas ] = useState(null);

  const [ mostrarEntregas, setMostrarEntregas ] = useState(false);
  const [ mostrarCalificaciones, setMostrarCalificaciones ] = useState(false);
  const [ mostrarEntregaExtraida, setMostrarEntregaExtraida ] = useState(false);
  const [ editarEntregaExtraida, setEditarEntregaExtraida ] = useState(false);  
  const [ editarEntregas, setEditarEntregas ] = useState(false);

  const cargarCalificaciones = async () => {
   const respuesta = await getCalificacionesByNRC(dataClase.nrc);
   return respuesta.data;
  }

  const cargarCriterios = async () => {
   const respuesta = await getCriteriosByNRC(dataClase.nrc);
   return respuesta.data; 
  }

  const cargarEntregas = async () => {
    let listaEntregas = await getEntregasByNRC(dataClase.nrc);
    if(listaEntregas.data.length>0)
    {
     return listaEntregas.data;
    }
    else
    {
     return [];
    }
  }

   const obtenerAlumnos = async () => {
     const inscripciones = await obtenerListaAlumnos(dataClase.nrc);
     const listaAlumnos = inscripciones.map( (inscripcion) => inscripcion.alumno_detail);
     return listaAlumnos;
    }
    
   const ordenarEntregasPorTipo = (listaEntregas, listaCriterios) => {
    let entregasOrdenadas = []
    let auxEntregas;
    for(let criterio of listaCriterios)
    {
     auxEntregas = listaEntregas.filter( (entrega) => entrega.tipo == criterio.id);
     entregasOrdenadas.push(auxEntregas);
    }
    return entregasOrdenadas;
   }

  
   
   const ordenarCalificacionesPorAlumno = (listaCalificaciones, listaAlumnos) => {
    let calificacionesPorAlumno = {}
    for(let alumno of listaAlumnos)
    {
     let auxCalificaciones = listaCalificaciones.filter( (calificacion) => calificacion.matricula == alumno.matricula)
     calificacionesPorAlumno[alumno.matricula] = auxCalificaciones;
    }
    console.log(calificacionesPorAlumno)
    return calificacionesPorAlumno;
   }

   const ordenAlfabetico = (a,b) =>{
    let entregaA = a.entrega_detail.nombre.toUpperCase();
    let entregaB = b.entrega_detail.nombre.toUpperCase();
    
    if(entregaA < entregaB)
    {
     return -1;
    }
    else if(entregaA > entregaB)
    {
     return 1;
    }
    else
     return 0;
   }

   const filtrarCalificacionesAlumnosPorTipo = (listaCalificaciones, listaAlumnos, listaCriterios) =>
   {
    let auxAlumnos = [...listaAlumnos];
    let auxCalificaciones;
    let calificacionesAlumno = [];
    for(let alumno of auxAlumnos)
    {
     calificacionesAlumno = []
     for(let criterio of listaCriterios)
     {
      auxCalificaciones = listaCalificaciones[alumno.matricula].filter( (calificacion) => calificacion.entrega_detail.tipo==criterio.id)
      auxCalificaciones.sort(ordenAlfabetico);
      calificacionesAlumno.push(auxCalificaciones);
     }
     alumno["calificacionesPorTipo"] = calificacionesAlumno;
    } 
    console.log(auxAlumnos)
    return auxAlumnos;
   }

   const obtenerCalificacionesParciales = (listaAlumnos, listaCriterios) => {
    let auxAlumnos = [...listaAlumnos];
    let calificacionAlumno = 0;
    let calificacionCriterio = 0;
    let ponderacionCriterio = 0;
    let numeroEntregas = 0;
    let sumaEntregas = 0;
    for(let alumno of auxAlumnos)
    {
     calificacionAlumno = 0;
     for(let k=0; k<listaCriterios.length;k++)
     {
      numeroEntregas = alumno.calificacionesPorTipo[k].length;
      ponderacionCriterio = listaCriterios[k].ponderacion; 
      sumaEntregas = alumno.calificacionesPorTipo[k].reduce( (valorPrevio, elementoActual) => valorPrevio+elementoActual.nota,0)
      calificacionCriterio = (sumaEntregas * ponderacionCriterio)/(numeroEntregas*10)
      calificacionAlumno += calificacionCriterio;
      //console.log("Alumno:"+alumno.nombre+", Suma:"+ parseFloat(calificacionCriterio))
     }
     alumno["calificacion"] = calificacionAlumno / 10;      
    }
    console.log(auxAlumnos)
   }

    const obtenerNombresCamposTabla = (listaEntregas) => {
     let nombresCampos = ["Alumno","Matricula"]
     let auxNombresCampos;
     for(let entrega of listaEntregas)
     {
      auxNombresCampos = entrega.map( (e) => e.nombre).toSorted();
      nombresCampos.push(...auxNombresCampos) 
     }
     console.log(nombresCampos);
     return nombresCampos;
    }

    const cargarDatosTabla = async () => {
     let listaAlumnos = await obtenerAlumnos();
     let listaEntregas = await cargarEntregas();
     let listaCriterios = await cargarCriterios();
     let listaCalificaciones = await cargarCalificaciones();

     let entregasPorTipo = ordenarEntregasPorTipo(listaEntregas, listaCriterios);
     let nombreCampos = obtenerNombresCamposTabla(entregasPorTipo);
     nombreCampos.push("Calificacion")
     nombreCampos.push("Final")
     nombreCampos.push("Acta");
     let calificacionesPorAlumno = ordenarCalificacionesPorAlumno(listaCalificaciones, listaAlumnos);
     listaAlumnos = filtrarCalificacionesAlumnosPorTipo(calificacionesPorAlumno, listaAlumnos, listaCriterios)
     obtenerCalificacionesParciales(listaAlumnos, listaCriterios);
     setCamposTabla(nombreCampos)
     setAlumnos(listaAlumnos)
    }


    useEffect(() => {


        console.log(dataClase.nrc);

        cargarDatosTabla();

        //showNav();
    }, [])
    
    console.log(shownav)

    const modificarEstadoArchivo = (archivoEntrega) => setArchivoEntrega(archivoEntrega)

    const mostrarVistaEntregas = () => {
     setMostrarCalificaciones(false);
    }

    const mostrarCardModificarEntrega = (id_entrega) => {
      let entrega = entregas.find( (e) => e.id == id_entrega);   
      setEntregaSeleccionada(entrega);
          controlModal.onOpen();
        
    }

    const mostrarCalificacionesEntrega = (id_entrega) => {
     let entrega = entregas.find( (e) => e.id == id_entrega);   
     setEntregaSeleccionada(entrega);
     setMostrarCalificaciones(true);
     console.log("Entrega: " + entrega + ", "+ mostrarCalificaciones);
    }  

    const extraerDatosArchivoEntrega = (tipo) => {
    
     if( archivoEntrega!=null && tipo!=null)
     {
      controlModal.onClose();
      leerArchivoEntrega(archivoEntrega, setMostrarEntregaExtraida, setCalificacionesExtraidas, dataClase.nrc);
     }
     else
     {
      toast.error("¡Se deben llenar todos los campos para poder crear la entrega!");
     }
    }

  return (
    <>
       <div className="flex justify-between">
       <h2 className="text-3xl font-semibold ml-8 mt-5 mb-9">{editarEntregas?(<> <FiEdit2 className="inline mr-3"/><span>Editar 2</span></>):"Calificaciones de las entregas"}</h2>
       <div>
           <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-9 font-bold text-base"
              onClick={controlModal.onOpen} >
              <i className="pi pi-question-circle" style={{fontSize:"16px",fontWeight:"bold"}}></i> 
           </Button>

           <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-9 font-bold text-base"
              onClick={controlModalImportacion.onOpen} >
              <i className="pi pi-download" style={{fontSize:"16px",fontWeight:"bold"}}></i> Descargar lista final
           </Button>


       </div>
      </div>
      <table >
      <thead>
       <tr>
       {
        camposTabla.map( (campo, index) => (
          <th key={index} className="p-3" style={{border:"1px solid white"}}>{campo}</th>
         )
        )
       }
       </tr>
      </thead>
      <tbody>
      {
       alumnos.map( (alumno, index) => (
       <tr key={index}>
        <td className="p-2" style={{border:"1px solid white"}}>{alumno.apellidos +" "+ alumno.nombre +" "}</td>
        <td className="p-2" style={{border:"1px solid white"}}>{alumno.matricula}</td>
        {
         alumno.calificacionesPorTipo.map( (tipoCalificacion) => tipoCalificacion.map( (calificacion, index) => (
          <td key={index} className="text-center" style={{border:"1px solid white"}}> {calificacion.nota}</td>
          )
         )
        )
        }
        <td className="p-2" style={{border:"1px solid white"}}> {alumno.calificacion}</td>
        <td className="p-2 text-center" style={{border:"1px solid white"}}> {Math.round(alumno.calificacion)}</td>
        <td className="p-2 text-center" style={{border:"1px solid white"}}> {Math.round(alumno.calificacion)>6?Math.round(alumno.calificacion):"5"}</td>

       </tr>
       )
      )
      }
      </tbody>
      </table>
      </>
)
}

export default RegistroCalificaciones;

