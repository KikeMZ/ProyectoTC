import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { extraerDatosMaterias } from '../services/importacion.js';
import ModalExtraerClases from "../components/modalExtraerClases";
import ClaseCard from "../components/cardClase";
import { Button, useDisclosure } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import { getClasesByPeriodo } from '../services/clases.api.js';

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
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);
  const [mostrarTarjetas, setMostrarTarjetas] = useState(false);
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [progress, setProgress] = useState(0);

  const [mensajeArchivo, setMensajeArchivo] = useState("");
  const [esArchivoValido, setEsArchivoValido] = useState(null);

  const inputRef = useRef(null); // Referencia al input file

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
    const archivo = e.target.files[0];

    if (archivo) {
      setArchivoSeleccionado(archivo);

      if (archivo.type === "application/pdf") {
        const reader = new FileReader();
        reader.readAsArrayBuffer(archivo);
        reader.onload = (e) => {
          setArchivoPDF(e.target.result);
        };
        setMensajeArchivo("Archivo compatible");
        setEsArchivoValido(true);
      } else {
        setMensajeArchivo("Solo se permiten archivos PDF");
        setEsArchivoValido(false);
        setArchivoPDF(null);
      }
    } else {
      limpiarArchivo();
    }
  };

  const limpiarArchivo = () => {
    setArchivoSeleccionado(null);
    setArchivoPDF(null);
    setMensajeArchivo("");
    setEsArchivoValido(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const leerPDF = async () => {
    // Validación de seguridad
    if (!archivoSeleccionado || !esArchivoValido) {
      toast.error("Seleccione un archivo PDF válido antes de continuar.");
      return;
    }

    setCargando(true);
    setProgress(10);
    
    setTimeout(async () => {
      const response = await extraerDatosMaterias(archivoPDF);
      setProgress(50);
      if (response) {
        const { resultado, clases: listaClases } = response;
        let nuevaLista = [];
        for (let i = 0; i < listaClases.length; i++) {
          const existe = lista.some((clase) => clase.nrc === listaClases[i].nrc);
          if (!existe) nuevaLista.push(listaClases[i]);
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
          const listaActualizada = [...lista, ...nuevaLista];
          localStorage.setItem(`clases_periodo_${id_periodo}`, JSON.stringify(listaActualizada));
        }
      } else {
        toast.error('Selecciona un archivo primero');
      }
      setCargando(false);
      setTimeout(() => setProgress(0), 500);
      limpiarArchivo();
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-full">
        <div className="flex justify-start items-start w-full">
          <Button onClick={() => navigate("/")} startContent={<i className="pi pi-chevron-left" />} className="font-semibold m-4 ml-1" variant="faded">
            Regresar a periodos
          </Button>
        </div>
        
        {!mostrarTarjetas && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-3xl font-bold mb-8">
              Parece que aún no tienes registrada ninguna clase para este periodo.
            </h1>
            <form className="mb-4">
              <input
                type="file"
                accept=".pdf"
                id="cargar"
                name="archivo"
                ref={inputRef}
                onChange={manejarArchivo}
                disabled={cargando}
              />
              {mensajeArchivo && (
                <p
                  className="text-sm mt-2 font-semibold"
                  style={{ color: esArchivoValido ? "green" : "red" }}
                >
                  {mensajeArchivo}
                </p>
              )}
            </form>

            <Button
              radius="large"
              disabled={!(archivoSeleccionado && esArchivoValido) || cargando}
              className={`mt-4 px-8 py-4 font-bold text-white transition-colors ${
                archivoSeleccionado && esArchivoValido
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={leerPDF}
            >
              {cargando ? <Spinner /> : "Importar clases"}
            </Button>
            <p className="text-xs text-gray-500 mt-2 italic">
              Nota: Solo se admiten archivos PDF.
            </p>

            {cargando && <ProgressBar progress={progress} />}
          </div>
        )}

        {mostrarTarjetas && (
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold">Clases - {nombre_periodo}</h1>
            <Button
              radius="large"
              className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white mt-10 text-base font-semibold"
              onClick={controlModal.onOpen}
            >
              Importar clases
            </Button>
            <h2 className="text-2xl font-semibold mt-3 ml-4">Total: {lista.length}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
              {lista.map((clase, index) => (
                <ClaseCard key={index} clase={clase} />
              ))}
            </div>
          </div>
        )}

        <ModalExtraerClases
          controlModal={controlModal}
          onManejarArchivo={manejarArchivo}
          extraerClases={leerPDF}
        />
      </div>
    </>
  );
}
