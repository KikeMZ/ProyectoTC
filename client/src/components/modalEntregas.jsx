import React, { useState, useEffect, useContext } from "react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter, useDisclosure, Button, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { claseContext } from "../layouts/layoutProfesor";
import { obtenerListaAlumnos } from "../services/inscripcion.api";
import { getCriteriosByNRC } from "../services/claseCriterio.api";
import { createEntrega } from "../services/entrega.api"
import { createCalificacion} from "../services/calificacion.api"

import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import { MdOutlineLibraryAdd } from "react-icons/md";


export default function ModalEntregas({ controlModal, setEntregas, setMostrarEntregas, nrc}) {
  const { datosClase } = useContext(claseContext)
  const [ criterios, setCriterios ] = useState([]);
  const [ nombreEntrega, setNombreEntrega ] = useState("");
  const [ tipo, setTipo ] = useState(null); 


  const crearEntrega = async () =>{
   let criterio = criterios.find( (c) => c.id==tipo);
   let listaAlumnos = await obtenerListaAlumnos(nrc);

   console.log(listaAlumnos)
   let entrega = {
    "nombre": nombreEntrega,
    "tipo": tipo,
   }
   createEntrega(entrega).then( (res) => {
    setEntregas( (listaEntregas) => [...listaEntregas, res.data]);
    setMostrarEntregas(true);
    for(let alumno of listaAlumnos)
    {
     let calificacion = {
      "nota": 0,
      "matricula": alumno.alumno_detail.matricula,
      "id_entrega": res.data.id
     }

     console.log(calificacion);
     createCalificacion(calificacion).then(console.log);
    }

   }
   )

   //setMaximo( (maximo) => maximo + ponderacion);
  }

  useEffect( ()=>{

    const obtenerCriterios = async () =>{

      let listaCriterios = await getCriteriosByNRC(nrc);
      setCriterios(listaCriterios.data);

    }

    obtenerCriterios();
  }, []);

  return (  
    <Modal classNames={{closeButton:"text-foreground-white text-2xl hover:bg-black active:text-black"}} isOpen={controlModal.isOpen} onOpenChange={controlModal.onOpenChange} >
    <ModalContent>
     {
      (onClose) => (
       <>
       <ModalHeader className="bg-gradient-to-tr from-primary-100 to-primary-200 text-xl text-white font-bold">
       <MdOutlineLibraryAdd size="28px" className="mr-2"/>

        Crear entrega
       </ModalHeader>
       <ModalBody className="gap-1 text-black">
        
         <label htmlFor="nombreE" className=" font-semibold mt-3">Nombre</label>
         <input id="nombreE" className="px-2 border-2 border-black rounded" onChange={(e) => setNombreEntrega( e.target.value)} required/>

         <label htmlFor="nombreP" className="font-semibold mt-2">Tipo</label>
         <Select onChange={(e) => setTipo( e.target.value)} isRequired radius="sm" classNames={{ label:"text-black"}} variant="bordered" labelPlacement={"outside"} placeholder="Seleccione un criterio" aria-label="Tipo">
          {
           criterios.map( (c) => (
            <SelectItem key={c.id} value={c.id} className="text-black text-2xl">
             {c.criterio_detail.nombre}
            </SelectItem>
           ))
          }

         </Select>

       </ModalBody>
       <ModalFooter>
        <Button color="danger" style={{fontWeight:"bold"}} onPress={onClose}>Cancelar</Button>
        <Button type="submit" color="success" style={{background:"green",color:"white" ,fontWeight:"bold"}} onPress={() => {crearEntrega(); onClose(); }}>Crear</Button>
       </ModalFooter>
       </>
      )
     }
    </ModalContent>
    </Modal>
);
}
