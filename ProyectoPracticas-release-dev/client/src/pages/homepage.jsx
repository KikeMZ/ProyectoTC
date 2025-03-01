
import React, { useState, useEffect } from 'react';
import { extraerDatosMaterias } from '../services/importacion.js';
import PeriodoCard from "../components/cardPeriodo";
import ModalPeriodo from "../components/modalPeriodo";
import { useForm } from "react-hook-form";
import { Button, useDisclosure } from "@nextui-org/react";
import {toast} from 'react-hot-toast';
import { getAllPeriodos, createPeriodo, updatePeriodo } from '../services/periodo.api.js';
import { getAllClases, getClasesByAlumno, crearClase } from '../services/clases.api.js';

import { parseDate } from "@internationalized/date";
import axios from "axios";
import { FiEdit2 } from 'react-icons/fi';
import { GrNext } from 'react-icons/gr';
import { IoIosArrowBack } from 'react-icons/io';


export default function Home() {

  const controlModal = useDisclosure();
  const [archivoPDF, setArchivoPDF] = useState(null); 
  const [clases, setClases] = useState([]);
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarTarjetas, setMostrarTarjetas] = useState(false);
  const [lista, setLista] = useState([]);


  useEffect(()=>{
    async function cargarPeriodos(){
      const res =  await getAllPeriodos();
      //const matricula = 201637439
      //const pruebaClases = await getClasesByAlumno(matricula)
      console.log(res);
      if(res.data.length>0)
      {
       setLista(res.data);
       setMostrarTarjetas(true);
      }
    }
    cargarPeriodos();
  },[]);

  const transformarFechaFormatoDjango = (fecha) => {
   return fecha.year +"-"+ fecha.month +"-"+ fecha.day;
  }

  
  const mostrarModalEditarPeriodo = (periodo) => {
   setPeriodoSeleccionado(periodo);
   controlModal.onOpen();
  }

  const actualizarPeriodo = (periodo) => {
    let listaActualizada = lista.filter((p) => p.id != periodo.id);
    let toastRegistro = toast.loading("Actualizando periodo...")
    console.log(periodo);
    periodo.fecha_inicio = transformarFechaFormatoDjango(periodo.fecha_inicio);
    periodo.fecha_finalizacion = transformarFechaFormatoDjango(periodo.fecha_finalizacion);
    //periodo.estado="ACTIVO";
    updatePeriodo(periodo.id,periodo).then((res) => {
  //   console.log("Periodo")
     if(lista.length==0)
      setLista([res.data])
     else
     {
      listaActualizada.push(res.data);
      setLista(listaActualizada);
     }
     toast.dismiss(toastRegistro);
     toast.success("¡Se ha actualizado el periodo exitosamente!");
     controlModal.onClose();
    }).catch( e => toast.error("¡Ha ocurrido un problema al intentar actualizar el periodo!, vuelva a pulsar el boton para volver a intentarlo."));

  }
  const registrarPeriodo = (periodo) => {
    let toastRegistro = toast.loading("Registrando periodo...")
    periodo.fecha_inicio = transformarFechaFormatoDjango(periodo.fecha_inicio);
    periodo.fecha_finalizacion = transformarFechaFormatoDjango(periodo.fecha_finalizacion);
    periodo.estado="ACTIVO";
    console.log(periodo);
    createPeriodo(periodo).then((res) => {
     console.log("Periodo")
     if(lista.length==0)
      setLista([res.data])
     else
      setLista([...lista,res.data])
     toast.dismiss(toastRegistro);
     toast.success("¡Se ha registrado el periodo exitosamente!");
     controlModal.onClose();
    }).catch( e => toast.error("¡Ha ocurrido un problema al intentar registrar el periodo!, vuelva a pulsar el boton para volver a intentarlo."));
  
  }



  return (
    <div className="flex flex-col items-start justify-start min-h-full w-full">
      {!mostrarTarjetas && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold mb-4">
            Parece que aún no se tiene registrado algun periodo.
          </h1>
          <Button
          radius="large"
          className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-5 font-bold text-base"
          onClick={controlModal.onOpen}
        >
          <i className="pi pi-plus font-semibold text-base"/> Crear periodo
        </Button>
        </div>
      )}

      {mostrarTarjetas && (
        <div className="w-full px-3 pt-4">
         <h2 className="text-4xl font-semibold py-2">{modoEdicion?(<> <FiEdit2 className="inline mr-3"/><span>Editar</span></>):'Periodos'}</h2>
         <hr className="border-1 mt-2"/>

         <div className="flex justify-end items-center mt-5 gap-6">

        {
         !modoEdicion && (
          <Button
           radius="large "
           className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 font-bold text-base"
           onClick={controlModal.onOpen}
          >
           <i className="pi pi-plus font-semibold text-base"/> Crear periodo
          </Button>
         )
        }
        <Button onPress={()=> {setModoEdicion(!modoEdicion);}} className=" text-base py-6 font-medium">
        
        {
         modoEdicion?
         (
          <>
          <IoIosArrowBack size="25px" className="text-xl"/>
          Regresar

          </>
         )
         :
         (
          <>
           <i className="pi pi-pencil"></i>
            Editar
          </>
         )
        }
       </Button>
       </div>



         <div className="grid grid-cols-3 gap-4 p-4 ">
           {lista.map((periodo, index) => (
             <PeriodoCard key={index} periodo={periodo} modoEdicion={modoEdicion} editarPeriodo={mostrarModalEditarPeriodo}/>
           ))}
         </div>
        </div>
      )}

     <ModalPeriodo controlModal={controlModal} modoEdicion={modoEdicion} crearPeriodo={registrarPeriodo} actualizarPeriodo={actualizarPeriodo} periodoSeleccionado={periodoSeleccionado}/>
     
    </div>
  );
}

