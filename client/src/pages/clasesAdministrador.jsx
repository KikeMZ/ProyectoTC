import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { extraerDatosMaterias } from '../services/importacion.js';
import ModalExtraerClases from "../components/modalExtraerClases";
import ClaseCard from "../components/cardClase";
import { Button, useDisclosure } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { getClasesByPeriodo } from '../services/clases.api.js';
import axios from "axios";

const Spinner = () => (
  <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full h-2 bg-gray-200 rounded mt-2">
    <div className="h-full bg-blue-500 rounded" style={{ width: `${progress}%`, transition: "width 0.3s ease-in-out" }}></div>
  </div>
);

export default function ClasesAdministrador() {
  const controlModal = useDisclosure();
  const navigate = useNavigate();

  const [archivoPDF, setArchivoPDF] = useState(null);
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);
  const [mostrarTarjetas, setMostrarTarjetas] = useState(false);
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [progress, setProgress] = useState(0);

  const id_periodo = new URLSearchParams(location.search).get('periodo');
  const nombre_periodo = new URLSearchParams(location.search).get('nombre');

  const mensajesImportacion = [
    "¡Se han importado los datos del PDF exitosamente!", 
    "¡El archivo PDF está vacío!", 
    "¡La estructura del documento no es válida!", 
    "¡El tipo de archivo no es válido!", 
    "¡Seleccione un archivo primero!" 
  ];

  useEffect(() => {
    // Intentamos cargar las clases del localStorage para el periodo actual
    const clasesGuardadas = localStorage.getItem(`clases_periodo_${id_periodo}`);
    if (clasesGuardadas) {
      setLista(JSON.parse(clasesGuardadas));
      setMostrarTarjetas(true);
    } else {
      async function cargarClases() {
        const res = await getClasesByPeriodo(id_periodo);
        if (res.data.length > 0) {
          setLista(res.data);
          setMostrarTarjetas(true);
        }
      }
      cargarClases();
    }
  }, [id_periodo]);

  const manejarArchivo = (e) => {
    let archivoSeleccionado = e.target.files[0];
    if (archivoSeleccionado) {
      let tipoArchivo = archivoSeleccionado.type;
      if (tipoArchivo === "application/pdf") {
        let leerArchivo = new FileReader();
        leerArchivo.readAsArrayBuffer(archivoSeleccionado);
        leerArchivo.onload = (e) => {
          setArchivoPDF(e.target.result);
        };
      } else {
        toast.error("Por favor seleccione un archivo PDF");
      }
    }
  };

  const leerPDF = async () => {
    setCargando(true);
    setProgress(10);
    
    setTimeout(async () => {
      const response = await extraerDatosMaterias(archivoPDF);
      setProgress(50);
      if (response) {
        const { resultado, clases: listaClases } = response;
        let nuevaLista = [];
        let bandera = 0;
        for (let i = 0; i < listaClases.length; i++) {
          bandera = 0;
          lista.forEach((clase) => {
            if (clase.nrc === listaClases[i].nrc) {
              bandera = 1;
            }
          });
          if (bandera === 0) {
            nuevaLista.push(listaClases[i]);
          }
        }
        if (nuevaLista.length > 0) {
          setLista([...lista, ...nuevaLista]);
        }
        setProgress(100);
        setResultadoExtraccion(resultado);
        setMostrarTarjetas(resultado === 0);

        if (resultado !== 0) {
          toast.error(mensajesImportacion[resultado]);
        } else {
          toast.success(mensajesImportacion[resultado]);
          controlModal.onClose();
          
          // Guardamos las clases en el localStorage bajo una clave única para el periodo
          const listaActualizada = [...lista, ...nuevaLista];
          localStorage.setItem(`clases_periodo_${id_periodo}`, JSON.stringify(listaActualizada));
        }
      } else {
        toast.error('Selecciona un archivo primero');
      }
      
      setCargando(false);
      setTimeout(() => setProgress(0), 500);
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="flex justify-start items-start w-full">
          <Button onClick={() => navigate("/")} startContent={<i className="pi pi-chevron-left" />} className="font-semibold mb-4 ml-16" variant="faded">
            Regresar a periodos
          </Button>
        </div>
        
        {!mostrarTarjetas && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-3xl font-bold mb-8">
              Parece que aún no tienes registrada ninguna clase para este periodo.
            </h1>
            <form className="mb-4">
              <input type="file" accept=".pdf" id="cargar" name="archivo" onChange={manejarArchivo} disabled={cargando} />
            </form>
            <Button radius="large" className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white mt-20" onClick={leerPDF} disabled={cargando}>
              {cargando ? <Spinner /> : "Importar clases"}
            </Button>
            {cargando && <ProgressBar progress={progress} />}
          </div>
        )}

        {mostrarTarjetas && (
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold">Clases - {nombre_periodo}</h1>
            <Button radius="large" className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white mt-10 text-base font-semibold" onClick={controlModal.onOpen}>
              Importar clases
            </Button>
            <h2 className="text-2xl font-semibold mt-3 ml-4">Total: {lista.length}</h2>
            <div className="grid grid-cols-3 gap-4 p-4">
              {lista.map((clase, index) => (
                <ClaseCard key={index} clase={clase} />
              ))}
            </div>
          </div>
        )}

        <ModalExtraerClases controlModal={controlModal} onManejarArchivo={manejarArchivo} extraerClases={leerPDF} />
      </div>
    </>
  );
}
