import React, { useContext, useState, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import CriterioModal from "../components/modalCriterios"
import { Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import toast from 'react-hot-toast';
import 'primeicons/primeicons.css';

const Crit = [
  {"nombre": "Tareas", "ponderacion": 20},
  {"nombre": "Practicas", "ponderacion": 20},
  {"nombre": "Proyecto", "ponderacion": 20},
  {"nombre": "Examen", "ponderacion": 20},
  {"nombre": "Asistencia", "ponderacion": 20},
];






const Criterios = () => {

  const { showNav, shownav } = useContext(NavContext);
  const controlModal = useDisclosure();

  const [ criterios, setCriterios ] = useState([]);
  const [ mostrarCriterios, setMostrarCriterios] = useState(false);
  const [ maximo, setMaximo ] = useState(0);
  
  const [archivoPDF, setArchivoPDF] = useState(null);


  const crearCriteriosGenerales = () =>{

  }

  const crearListaCriterios = () => {
   if(maximo==100)
   {
    crearCriteriosGenerales();
    toast.success("¡Se han guardado los criterios correctamente!")
   }
   else
   {
    toast.error("¡Accion no valida!, para guardar los cambios todos los criterios deben sumar 100%.")
   }
  }
  
  //
  // ----------------------------------------------------
  // --- Estados de la variable 'resultadoExtraccion' ---
  // ----------------------------------------------------
  //
  // 0 => Indica que la extraccion se realizo correctamente
  //
  // 1 => Indica que el archivo esta vacio
  //
  // 2 => Indica que el Excel tiene una estructura interna invalida.
  //
  // 3 => Indica que se ha seleccionado un archivo con un tipo diferente a PDF
  //
  // 4 => Indica que se intentando comenzar con el proceso de lectura del PDF sin tener algun archivo seleccionado.
  //
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);

  // Esta variable contiene los mensajes que aparecen en cada uno de los posibles escenarios identificados hasta el momento.
  const mensajesImportacion = ["¡Se han importado los datos del PDF exitosamente!",
                               "¡¡¡El archivo PDF esta vacio!!!",
                               "¡¡¡La estructura del documento no es valida!!!",
                               "¡¡¡El tipo de archivo no es valido!!!",
                               "¡Seleccione primero un archivo!",  
                              ];


  
    //
    // ----------------------------------------------------------------------------------
    //  Esta funcion detecta cuando se ha seleccionado un archivo mediante el formulario
    // ----------------------------------------------------------------------------------
    //
    const manejarArchivo = (e) =>{
      let archivoSeleccionado = e.target.files[0];
  
      if (archivoSeleccionado) {
        let tipoArchivo = archivoSeleccionado.type;
        console.log(tipoArchivo);
        if (tipoArchivo === "application/pdf" || tipoArchivo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") { // Validar que sea un archivo PDF
          let leerArchivo = new FileReader();
          leerArchivo.readAsArrayBuffer(archivoSeleccionado);
          leerArchivo.onload = (e) => {
            setArchivoPDF(e.target.result);
          };
        }
        else
        {
         setResultadoExtraccion(3);
        } 
  
      }
    }
    

  
  useEffect(() => {
    showNav();
  }, [])

  console.log(shownav)

  return (
    <div>
            {(!mostrarCriterios) &&  (
            <div className="flex flex-col items-center justify-start min-h-full">
              <div className="flex flex-col items-center justify-center">
                    <h1 className="text-center text-3xl font-bold mt-6 mb-4">Parece que aun no hay ningun criterios de evaluacion para esta clase.</h1>
                    <h3 className="text-center text-xl mb-8" style={{color:"lightgrey"}}>Comience con alguna de las siguientes opciones:</h3>

                    <div>
                    <Button
                        radius="large"
                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white px-6 py-6 mt-2 mr-3 mb-10 font-bold text-base"
                        onClick={ ()=>{setMostrarCriterios(true)}}
                    >
                        <i className="pi pi-plus" style={{fontSize:"16px",fontWeight:"bold"}}></i> Crear criterios
                    </Button>

                    <Button
                        radius="large"

                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 mb-10 font-bold text-base"
                        onClick={ ()=>{setMostrarCriterios(true)}}
                    >
                        <i className="pi pi-folder-open" style={{fontSize:"18px",fontWeight:"bold"}}></i> Importar criterios
                    </Button>
                    </div>
        
        
                </div>
                </div>
            )}

    {

     mostrarCriterios && (
     <>
     <div className="flex items-col justify-between">
      <Button className="py-6 text-base">
        <i className="pi pi-times"></i>Cancelar</Button>
      <Button onPress={crearListaCriterios} className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 mb-10 text-base"
                        >
       <i className="pi pi-save" style={{fontSize:"20px"}}></i> Guardar</Button>
     </div>
      <div>
      {criterios.map((item, index) => (
        <Card key={index} className="my-2">
          <CardBody>
            <div className="flex items-center justify-between">
              <span>{item.nombre}</span>
              <span>{item.ponderacion}%</span>
            </div>
          </CardBody>
        </Card>
      ))}

      {
       
                    <Button

                        radius="large"

                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-10 mt-3 mb-10 font-bold text-base"
                        onClick={controlModal.onOpen}
                    >
                    <i className="pi pi-plus"></i> Agregar criterio
                    </Button>
      }
    </div>

    <CriterioModal controlModal={controlModal} setCriterios={setCriterios} maximo={maximo} setMaximo={setMaximo}></CriterioModal>

    </>
     )
    }
    </div>
  )
}

export default Criterios