import React, { useState, useEffect, useContext } from "react";
import { Modal, ModalHeader, ModalBody, ModalContent, ModalFooter, useDisclosure, Button, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { parseDate } from "@internationalized/date";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import {DatePicker} from '@nextui-org/react';
import { MdOutlineLibraryAdd } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import toast from "react-hot-toast";


export default function ModalPeriodo({ controlModal, modoEdicion, crearPeriodo, periodo}) {
  //const { datosClase } = useContext(claseContext)
 // const [ plan, setPlan ] = useState([]);
  const [ nombrePeriodo, setNombrePeriodo ] = useState("");
  const [ plan, setPlan ] = useState(""); 
  const [ fechaInicio, setFechaInicio ] = useState(null);
  const [ fechaFinalizacion, setFechaFinalizacion ] = useState(null);

  const { register, handleSubmit, reset, control } = useForm();
  const listaPlanes = ["SEMESTRAL","CUATRIMESTRAL"];

  useEffect(()=>{
   reset(periodo);
  },[periodo]);


  if(modoEdicion) return(
    <Modal isDismissable={false} classNames={{closeButton:"text-foreground-white text-2xl hover:bg-black active:text-black"}} isOpen={controlModal.isOpen} onOpenChange={controlModal.onOpenChange} >
    <ModalContent>
     {
      (onClose) => (
       <>
        <ModalHeader className="bg-gradient-to-tr from-primary-100 to-primary-200 text-xl text-white font-bold">
        <TbEdit size="30px" className="mr-2"></TbEdit>
         Editar periodo



        </ModalHeader>

        <form onSubmit={handleSubmit( (periodo) => crearPeriodo(periodo))}>
       <ModalBody className="gap-1 text-black">
         <label htmlFor="nombrePeriodo" className=" font-semibold mt-3">Nombre</label>
         <input id="nombrePeriodo" className="px-2 border-2 border-black rounded" {...register("nombre")} required/>
        
         <label htmlFor="nombreP" className="font-semibold mt-2">Plan de estudios</label>

         <Controller
          name="plan"
          control={control}
          render={ ({field:{onChange}}) => (
           <Select onChange={onChange} isRequired radius="sm" classNames={{ label:"text-black"}} variant="bordered" labelPlacement={"outside"} placeholder={modoEdicion?periodo.plan:"Seleccione el tipo de plan"} aria-label="Tipo">
            {
             listaPlanes.map( (p, index) => (
              <SelectItem key={p} value={p} className="text-black text-2xl">
               {p}
              </SelectItem>
             ))
            }
           </Select>
           )
          }
         />

       </ModalBody>

    </form>

      </>
      )
     }
    </ModalContent>


    </Modal>
    
  ); 
  

  return(  
    <Modal isDismissable={false} classNames={{closeButton:"text-foreground-white text-2xl hover:bg-black active:text-black"}} isOpen={controlModal.isOpen} onOpenChange={controlModal.onOpenChange} >
    <ModalContent>
     {
      (onClose) => (
       <>
       <ModalHeader className="bg-gradient-to-tr from-primary-100 to-primary-200 text-xl text-white font-bold">
       {
        modoEdicion
        ?
        (
        <>
         <TbEdit size="30px" className="mr-2"></TbEdit>
         Editar periodo
        </>
        )
        :
        (
        <>
        <MdOutlineLibraryAdd size="28px" className="mr-2"/>

        Crear periodo
        </>
        )
       }
       </ModalHeader>
       <form onSubmit={handleSubmit( (periodo) => crearPeriodo(periodo))}>
       <ModalBody className="gap-1 text-black">
         <label htmlFor="nombrePeriodo" className=" font-semibold mt-3">Nombre</label>
         <input id="nombrePeriodo" className="px-2 border-2 border-black rounded" {...register("nombre")} required/>
        
         <label htmlFor="nombreP" className="font-semibold mt-2">Plan de estudios</label>

         <Controller
          name="plan"
          control={control}
          render={ ({field:{onChange}}) => (
           <Select onChange={onChange} isRequired radius="sm" classNames={{ label:"text-black"}} variant="bordered" labelPlacement={"outside"} placeholder={modoEdicion?periodo.nombre:"Seleccione el tipo de plan"} aria-label="Tipo">
            {
             listaPlanes.map( (p, index) => (
              <SelectItem key={p} value={p} className="text-black text-2xl">
               {p}
              </SelectItem>
             ))
            }
           </Select>
           )
          }
         />

         <label htmlFor="fechaInicio" className=" font-semibold mt-3">Fecha de inicio</label>

         <Controller
          name="fecha_inicio"
          control={control}
          render={ ({field: {onChange, value}}) => (
           <DatePicker onChange={ onChange } variant="bordered" radius="sm" value={value} isRequired></DatePicker>
           )
          }
         />

         <label htmlFor="fechaFinalizacion" className=" font-semibold mt-3"> Fecha de termino</label>
         <Controller
          name="fecha_finalizacion"
          control={control}
          render={({field: {onChange, value}}) => (
           <DatePicker onChange={onChange} variant="bordered" radius="sm" value={value} isRequired/>
           )
          }
         />
       </ModalBody>
       <ModalFooter>
        <Button color="danger" style={{fontWeight:"bold"}} onPress={onClose}>Cancelar</Button>

        {
         modoEdicion?
         (
          <>
          <Button type="submit" color="success" style={{background:"green",color:"white" ,fontWeight:"bold"}} onPress={() => { }}>Guardar cambios</Button>
           
          </>
         )
         :
         (
          <>
          <Button type="submit" color="success" style={{background:"green",color:"white" ,fontWeight:"bold"}} >Crear</Button>
          </>
         )
        }
       </ModalFooter>
       </form>
       </>
      )
     }
    </ModalContent>
    </Modal>
);
}
