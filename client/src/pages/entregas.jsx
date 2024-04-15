import React, { useContext, useState,  useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import { claseContext } from "../layouts/layoutProfesor";
import ModalEntregas from "../components/modalEntregas";


import { Input, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import toast from 'react-hot-toast';



const Entregas = () => {

  const { showNav, shownav } = useContext(NavContext);
  const { dataClase } = useContext(claseContext);
  const controlModal = useDisclosure();
  
  const [ entregas, setEntregas ] = useState([]);
  const [ mostrarEntregas, setMostrarEntregas ] = useState(false);

    useEffect(() => {
        showNav();
    }, [])
    
    console.log(shownav)

  
    
  return (
    <>
    <div className="flex flex-col items-center justify-start min-h-full">
    <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold mt-6 mb-4">Parece que aun no hay ninguna entrega para esta clase.</h1>
          <div>
          <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-10 font-bold text-base"
              onClick={controlModal.onOpen}
          >
              <i className="pi pi-plus" style={{fontSize:"16px",fontWeight:"bold"}}></i> Crear entrega
          </Button>

          </div>


      </div>
      </div>
      <ModalEntregas controlModal={controlModal} setEntregas={setEntregas} nrc={dataClase.nrc}></ModalEntregas>
      </>
)
}

export default Entregas