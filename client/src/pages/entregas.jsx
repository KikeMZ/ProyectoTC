import React, { useContext, useState,  useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import { claseContext } from "../layouts/layoutProfesor";
import Calificaciones from "./calificaciones"
import ModalEntregas from "../components/modalEntregas";
import { getEntregasByNRC } from "../services/entrega.api"


import { Input, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import toast from 'react-hot-toast';
import { GrNext } from "react-icons/gr";



const Entregas = () => {

  const { showNav, shownav } = useContext(NavContext);
  const { dataClase } = useContext(claseContext);
  const controlModal = useDisclosure();
  
  const [ entregas, setEntregas ] = useState([]);
  const [ entregaSeleccionada, setEntregaSeleccionada ] = useState(null);

  const [ mostrarEntregas, setMostrarEntregas ] = useState(false);
  const [ mostrarCalificaciones, setMostrarCalificaciones ] = useState(false);


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

    const mostrarCalificacionesEntrega = (id_entrega) => {
     let entrega = entregas.find( (e) => e.id == id_entrega);   
     setEntregaSeleccionada(entrega);
     setMostrarCalificaciones(true);
     console.log("Entrega: " + entrega + ", "+ mostrarCalificaciones);
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
       <h2 className="text-3xl font-semibold ml-8 mt-5">Entregas</h2>
          <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-9 font-bold text-base"
              onClick={controlModal.onOpen}
          >
              <i className="pi pi-plus" style={{fontSize:"16px",fontWeight:"bold"}}></i> Crear entrega
          </Button>
       </div>
      {
       entregas.map( (entrega, index) => (
        <Button onClick={ () => mostrarCalificacionesEntrega(entrega.id)} className="flex bg-white justify-between w-full mb-4 py-9" key={index} endContent={<GrNext className="text-xl"/> }>
         <div >
         <p className="text-2xl font-medium ml-4">
         {
          entrega.nombre
         }
         </p>
         <p className="flex justify-start ml-4">
         {
          entrega.claseCriterio_detail.criterio_detail.nombre
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
      <ModalEntregas controlModal={controlModal} setEntregas={setEntregas} setMostrarEntregas={setMostrarEntregas} nrc={dataClase.nrc}></ModalEntregas>
    </>
    ):
    (
    <Calificaciones nrc={dataClase.nrc} entrega={entregaSeleccionada} />
    )
    }
      </>
)
}

export default Entregas;