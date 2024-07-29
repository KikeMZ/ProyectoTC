import React, { useState, useEffect, useContext } from "react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter, useDisclosure, Button, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";

import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import { MdOutlineLibraryAdd } from "react-icons/md";




export default function ModalExtraerClases({ controlModal, onManejarArchivo, extraerClases}) {
 // const { datosClase } = useContext(claseContext)
  const [ correos, setCorreos ] = useState([]);
  const [ nombreEntrega, setNombreEntrega ] = useState("");
  const [ tipo, setTipo ] = useState(null); 


  useEffect( ()=>{

  }, []);

  return (  
    <Modal isDismissable={false} classNames={{closeButton:"text-foreground-white text-2xl hover:bg-black active:text-black"}} isOpen={controlModal.isOpen} onOpenChange={controlModal.onOpenChange} >
    <ModalContent>
     {
      (onClose) => (
       <>
       <ModalHeader className="bg-gradient-to-tr from-primary-100 to-primary-200 text-xl text-white font-bold">
       <MdOutlineLibraryAdd size="28px" className="mr-2"/>

        Importar clases
       </ModalHeader>
       <ModalBody className="gap-1 text-black">
        
       <label htmlFor="cargar" className="text-xl font-semibold my-2">Seleccione su archivo: </label>
       
       <input type="file" accept=".pdf" id="cargar" name="archivo" onChange={ (e) => {onManejarArchivo(e)} } />

       </ModalBody>
       <ModalFooter>
        <Button color="danger" style={{fontWeight:"bold"}} className="px-12 py-6 mt-2" onPress={onClose}>Cancelar</Button>
        <Button
                        radius="large"

                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 mb-10 font-bold text-base"
                        onClick={() => {extraerClases();}}
                    >
                        <i className="pi pi-folder-open" style={{fontSize:"18px",fontWeight:"bold"}}></i> Extraer datos
                    </Button>


       </ModalFooter>
       </>
      )
     }
    </ModalContent>
    </Modal>
);
}
