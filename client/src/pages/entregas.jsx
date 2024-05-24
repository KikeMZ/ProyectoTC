import React, { useContext, useState,  useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import { claseContext } from "../layouts/layoutProfesor";
import Calificaciones from "./calificaciones";
import RegistroCalificaciones from "./registroCalificaciones";
import ModalEntregas from "../components/modalEntregas";
import ModalImportarEntrega from "../components/modalImportarEntrega";
import { manejarArchivo, leerArchivoEntrega } from "../services/importacion"
import { getEntregasByNRC } from "../services/entrega.api"


import { Link } from "react-router-dom";
import { Input, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import toast from 'react-hot-toast';
import { FiEdit2 } from 'react-icons/fi';
import { GrNext } from "react-icons/gr";




const Entregas = () => {

  const { showNav, shownav } = useContext(NavContext);
  const { dataClase } = useContext(claseContext);
  const controlModal = useDisclosure();
  const controlModalImportacion = useDisclosure();
  const controlModalRegistro = useDisclosure();
  
  const [ archivoEntrega, setArchivoEntrega ] = useState(null);
  const [ entregas, setEntregas ] = useState([]);
  const [ entregaExtraida, setEntregaExtraida ] = useState(null)
  const [ entregaSeleccionada, setEntregaSeleccionada ] = useState(null);
  const [ calificacionesExtraidas, setCalificacionesExtraidas ] = useState(null);

  const [ mostrarEntregas, setMostrarEntregas ] = useState(false);
  const [ mostrarCalificaciones, setMostrarCalificaciones ] = useState(false);
  const [ mostrarReporte, setMostrarReporte ] = useState(false); 
  const [ mostrarEntregaExtraida, setMostrarEntregaExtraida ] = useState(false);
  const [ editarEntregaExtraida, setEditarEntregaExtraida ] = useState(false);  
  const [ editarEntregas, setEditarEntregas ] = useState(false);
  
  
    

    useEffect(() => {

        const cargarEntregas = async () => {
         let listaEntregas = await getEntregasByNRC(dataClase.nrc);
         if(listaEntregas.data.length>0)
         {
          setEntregas(listaEntregas.data);
          setMostrarEntregas(true);
         }
        }

        cargarEntregas();

        showNav();
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

    {
     !mostrarCalificaciones?

     (
     <>
    {
     !mostrarEntregas?
     (
      <div className="flex flex-col items-center justify-start min-h-full">
      <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold mt-6 mb-4">Parece que aun no hay ninguna entrega para esta clase.</h1>
          <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-10 font-bold text-base"
              onClick={controlModal.onOpen}
          >
              <i className="pi pi-plus" style={{fontSize:"16px",fontWeight:"bold"}}></i> Crear entrega
          </Button>



      </div>
      </div>
      )
      : 
      (
       <>
       <div className="flex justify-between">
       <h2 className="text-3xl font-semibold ml-8 mt-5 mb-9">{editarEntregas?(<> <FiEdit2 className="inline mr-3"/><span>Editar</span></>):"Entregas"}</h2>
       <div>
          {
           !editarEntregas &&
           (
           <>

           <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-9 font-bold text-base"
              onClick={controlModal.onOpen} >
              <i className="pi pi-plus" style={{fontSize:"16px",fontWeight:"bold"}}></i> Crear entrega
           </Button>

           <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-9 font-bold text-base"
              onClick={controlModalImportacion.onOpen} >
              <i className="pi pi-plus" style={{fontSize:"16px",fontWeight:"bold"}}></i> Importar entrega
           </Button>

           </>
           )
          }

          <Button onClick={controlModalRegistro.onOpen} variant="faded" radius="large" className="py-6 ml-3 text-base">
            Registro
          </Button>

          <Button onClick={() => setEditarEntregas(!editarEntregas)} variant="faded" radius="large" className="py-6 ml-3 text-base">
           {
            editarEntregas
            ?
            (
             <>
              Regresar
             </>
            )
            :
            (
            <>
            <FiEdit2 size="19px"></FiEdit2>
            Editar entregas
            </>
            )
           }
          </Button>

       </div>
       </div>
      {
       entregas.map( (entrega, index) => (
        <Button onClick={ () => editarEntregas?mostrarCardModificarEntrega(entrega.id):mostrarCalificacionesEntrega(entrega.id)} className="flex bg-white justify-between w-full mb-4 py-11" key={index} endContent={ editarEntregas?<p className="text-base mr-2"> Editar</p>:<GrNext className="text-xl"/> }>
         <div >
         <p className="text-2xl font-medium ml-4" style={{width:'0px'}}>
         {
          entrega.nombre
         }
         </p>
         <p className="flex justify-start ml-4">
         {
          entrega.claseCriterio_detail.criterio_detail.nombre
         }
         </p>

         <p className="text-xs ml-4">
         {
          entrega.fecha
         }
         </p>
         </div>
        </Button>
       )
      )
      }
      </>
     )
    }
      <ModalEntregas controlModal={controlModal} modoEdicion={editarEntregas} setEntregas={setEntregas} setMostrarEntregas={setMostrarEntregas} nrc={dataClase.nrc} entrega={entregaSeleccionada} ></ModalEntregas>
      <ModalImportarEntrega controlModal={controlModalImportacion} modoEdicion={editarEntregaExtraida} entrega={entregaExtraida} setEntregaExtraida={setEntregaExtraida} setCalificacionesExtraidas={setCalificacionesExtraidas} manejarArchivo={manejarArchivo} setArchivoEntrega={modificarEstadoArchivo} extraerDatosArchivoEntrega={extraerDatosArchivoEntrega} nrc={dataClase.nrc}/>
      <RegistroCalificaciones controlModal={controlModalRegistro} entregasExistentes={entregas}/>
    </>
    ):
    (
    <Calificaciones nrc={dataClase.nrc} entrega={entregaSeleccionada} mostrarVistaEntregas={mostrarVistaEntregas} />
    )
    }
      </>
)
}

export default Entregas;