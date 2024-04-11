import React, { useState, useContext } from "react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter, useDisclosure, Button, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { claseContext } from "../layouts/layoutProfesor";

export default function CriterioModal({ controlModal, setCriterios, setMaximo, maximo }) {
  const { datosClase } = useContext(claseContext)
  const [ nombreCriterio, setNombreCriterio ] = useState("");
  const [ ponderacion, setPonderacion ] = useState(0); 


  const crearCriterio = () =>{
   let criterio = {
    "nombre": nombreCriterio,
    "ponderacion": ponderacion,
    "nrc": 2,//datosClase.nrc
   }
   
   setCriterios( (listaCriterios) => [...listaCriterios, criterio]);
   setMaximo( (maximo) => maximo + ponderacion);
  }

  return (  
    <Modal isOpen={controlModal.isOpen} onOpenChange={controlModal.onOpenChange} >
    <ModalContent>
     {
      (onClose) => (
       <>
       <ModalHeader className="text-black ">
        Introduzca los datos del criterio
       </ModalHeader>
       <ModalBody className="text-black">
        <div className="flex">
         <label htmlFor="nombreC" className="inline">Nombre:</label>
         <input id="nombreC" className="ml-2 px-2 border-2 border-black " onChange={(e) => setNombreCriterio(e.target.value)}/>
        </div>

        <div className="flex">
         <label htmlFor="nombreP" className="inline">Ponderacion:</label>
         <input id="nombreP" type="number" placeholder="0" max={100 - maximo} min="0" maxLength="2" onChange={(e) => setPonderacion(parseInt(e.target.value))} className="ml-2 px-2 border-2 border-black "/>
        &nbsp;%
        </div>

       </ModalBody>
       <ModalFooter>
        <Button color="danger" style={{fontWeight:"bold"}} onPress={onClose}>Cancelar</Button>
        <Button color="success" style={{background:"green",color:"white" ,fontWeight:"bold"}} onPress={() => {crearCriterio( (criterios) => [...criterios,""]); onClose(); }}>Crear</Button>
       </ModalFooter>
       </>
      )
     }
    </ModalContent>
    </Modal>
);
}
