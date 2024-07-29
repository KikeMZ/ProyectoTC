
import React, { useState, useEffect } from 'react';
import { extraerDatosMaterias } from '../services/importacion.js';
import PeriodoCard from "../components/cardPeriodo";
import ModalPeriodo from "../components/modalPeriodo";
import { useForm } from "react-hook-form";
import { Button, useDisclosure } from "@nextui-org/react";
import {toast} from 'react-hot-toast';
import { getAllPeriodos, createPeriodo } from '../services/periodo.api.js';
import { getAllClases, crearClase } from '../services/clases.api.js';
import axios from "axios";


export default function Home() {

  const controlModal = useDisclosure();
  const [archivoPDF, setArchivoPDF] = useState(null); 
  const [clases, setClases] = useState([]);
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);
  const [mostrarTarjetas, setMostrarTarjetas] = useState(false);
  const [lista, setLista] = useState([]);


  useEffect(()=>{
    async function cargarPeriodos(){
      const res =  await getAllPeriodos();
      console.log(res);
      if(res.data.length>0)
      {
       setLista(res.data)
       setMostrarTarjetas(true);
      }
    }
    cargarPeriodos();
  },[]);

  const transformarFechaFormatoDjango = (fecha) => {
   return fecha.year +"-"+ fecha.month +"-"+ fecha.day;
  }

  
  const registrarPeriodo = (periodo) => {
    let toastRegistro = toast.loading("Registrando periodo...")
    periodo.fecha_inicio = transformarFechaFormatoDjango(periodo.fecha_inicio);
    periodo.fecha_finalizacion = transformarFechaFormatoDjango(periodo.fecha_finalizacion);
    periodo.estado="ACTIVO";
    console.log(periodo);
    createPeriodo(periodo).then((res) => {
     console.log("Periodo")
     setLista([...lista,res.data])
     toast.dismiss(toastRegistro);
     toast.success("¡Se ha registrado el periodo exitosamente!");
     controlModal.onClose();
    }).catch( e => toast.error("¡Ha ocurrido un problema al intentar registrar el periodo!, vuelva a pulsar el boton para volver a intentarlo."));
  
  }



  return (
    <div className="flex flex-col items-center justify-center min-h-full">
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
        <div>
         <h2 className="text-4xl font-semibold">Periodos</h2>
         <hr className="border-1 mt-2"/>
         <Button
          radius="large"
          className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-5 font-bold text-base"
          onClick={controlModal.onOpen}
        >
          <i className="pi pi-plus font-semibold text-base"/> Crear periodo
        </Button>


         <div className="grid grid-cols-3 gap-4 p-4 ">
           {lista.map((periodo, index) => (
             <PeriodoCard key={index} periodo={periodo} />
           ))}
         </div>
        </div>
      )}

     <ModalPeriodo controlModal={controlModal} modoEdicion={false} crearPeriodo={registrarPeriodo} periodo={null}/>
     
    </div>
  );
}

