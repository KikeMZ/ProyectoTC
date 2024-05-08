import React, { useContext, useState, useRef, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import { claseContext } from "../layouts/layoutProfesor";
import CriterioModal from "../components/modalCriterios"
import { Input, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import { getAllCriterios, crearCriterio } from '../services/criterios.api';
import { getAllClaseCriterio, createClaseCriterio, getCriteriosByNRC, updateClaseCriterio, deleteClaseCriterio } from '../services/claseCriterio.api';
import toast from 'react-hot-toast';
import 'primeicons/primeicons.css';
import { MdDelete } from 'react-icons/md';

const criteriosPredeterminados = [
  {"nombre": "Tareas", "ponderacion": 20},
  {"nombre": "Practicas", "ponderacion": 20},
  {"nombre": "Proyecto", "ponderacion": 20},
  {"nombre": "Examen", "ponderacion": 20},
  {"nombre": "Asistencia", "ponderacion": 20},
];






const Criterios = () => {

  const { showNav, shownav } = useContext(NavContext);
  const { dataClase } = useContext(claseContext)
  const controlModal = useDisclosure();

  const [ criterios, setCriterios ] = useState([]);
  const criteriosModificados = useRef([]);
  const [ criteriosEliminados, setCriteriosEliminados ] = useState([])
  const [ existenCriterios, setExistenCriterios] = useState(false);
  const [ mostrarCriterios, setMostrarCriterios] = useState(false);
  const [ editarCriterios, setEditarCriterios] = useState(false);
  const [ maximo, setMaximo ] = useState(0);
  
  const [archivoPDF, setArchivoPDF] = useState(null);


  const crearCriteriosGenerales = async () => {
   let nombresCriteriosBD = [];
   let criteriosUnicos = []
   
   let criteriosBD = criterios.filter( (c) => c.id>-1)
   let criteriosActualizados = criteriosBD
   let res = await getAllCriterios();
     console.log("Inicio"+res.data);
     nombresCriteriosBD = res.data.map( (c) => c.nombre);
     criteriosUnicos = criterios.filter( (c) => !nombresCriteriosBD.includes(c.nombre));
     console.log(criteriosUnicos + ":" + criterios)
     if(criteriosUnicos.length>0)
     {
      for( let criterio of criteriosUnicos)
      {
       console.log("c"+criterio.nombre);
       let res2 = await crearCriterio({"nombre":criterio.nombre})
        let auxCriterioAgregado = {
         "id": res2.data.id_criterio,
         "nombre": criterio.nombre,
         "ponderacion": criterio.ponderacion,
        
        }
        criteriosActualizados.push( auxCriterioAgregado);
      }
     }

     
//   }).finally( () => {
    console.log("Salida:"+ criteriosActualizados);
   
   
   return await criteriosActualizados;
  }

  const crearListaCriterios = async () => {
   if(maximo==100)
   {
     let criteriosActualizados = await crearCriteriosGenerales();


     console.log("DD:"+criteriosActualizados)
 //    crearCriteriosGenerales().then( (res) => console.log("R:"+ res));
 //    console.log("CA:"+ criteriosActualizados)
     for( let criterio of criteriosActualizados)
     {
      let claseCriterio = {
       "id_clase": dataClase.nrc,
       "id_criterio": criterio.id,
       "ponderacion": criterio.ponderacion
      }
      createClaseCriterio(claseCriterio).then(console.log);

    }

    setEditarCriterios(false);
    setExistenCriterios(true);
    toast.success("¡Se han guardado los criterios correctamente!")
   }
   else
   {
    toast.error("¡Accion no valida!, para guardar los cambios todos los criterios deben sumar 100%.")
   }
  }
  
  const modificarCriterio = (nombreCriterio, valor) =>{
   let auxCriterios = criterios;
   let posicionCriterio = criterios.findIndex( (c) => c.nombre==nombreCriterio)
   console.log(auxCriterios[posicionCriterio]);
   if(!isNaN(valor) && valor!="")
   {
   // if(auxCriterios[posicionCriterio].ponderacion>valor)
     
     setMaximo(maximo- parseInt(auxCriterios[posicionCriterio].ponderacion)+parseInt(valor))
   // else
   //  setMaximo(maximo+1)
    auxCriterios[posicionCriterio].ponderacion = parseInt(valor);
   }
   else
   {
    auxCriterios[posicionCriterio].nombre = valor;
    console.log(auxCriterios)
//    setMaximo(maximo)
   }
   setCriterios(auxCriterios);
/*   else
   {
    let criterio = criterios.find( (c) => c.nombre==nombreCriterio)
    if(!isNaN(valor))
     criterio.ponderacion = valor; 
    else
     criterio.nombre = valor;
    criteriosModificados.current.push(criterio);
   }*/
  }

  const eliminarCriterio = (nombre) =>{
   let criterio = criterios.find( (c) => c.nombre==nombre)
   setCriteriosEliminados([...criteriosEliminados,criterio]);
   console.log(criterios.filter( (c) => c.nombre!=nombre));
   setCriterios(criterios.filter( (c) => c.nombre!=nombre));
   setMaximo(maximo-criterio.ponderacion);
  }

  const guardarModificaciones = () => {
   console.log(criteriosEliminados.length);
   if(maximo==100)
   {
    if(criteriosEliminados.length>0)
    {
     for(let criterio of criteriosEliminados)
     {
      deleteClaseCriterio(criterio.id).then(console.log);
     }
    }

    for(let criterio of criterios)
    {
     if(criterio.id!=-1)
      updateClaseCriterio(criterio.id, criterio)
     
      
    }
    setEditarCriterios(false);
    setExistenCriterios(true);
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
    

  
  useEffect( () => {

    const cargarCriterios = async() =>{
     try{
      let listaCriterios = await getCriteriosByNRC(dataClase.nrc);
      console.log("r"+listaCriterios.data.length)
      if(listaCriterios.data.length>0)
      {
       console.log("r"+listaCriterios.data.length)
       let criteriosClase = listaCriterios.data.map( (c) => {
        let auxCriterio = {
        "id": c.id,
        "nombre": c.criterio_detail.nombre,
        "ponderacion": c.ponderacion
        }
        return auxCriterio;
       }
       )
       setCriterios(criteriosClase);
       setExistenCriterios(true); 
       setMostrarCriterios(true);
       setMaximo(100);
      }
     } catch(e)
     {
      console.log(e);
     }
    }

    cargarCriterios();
    showNav();
  }, [])

  useEffect(()=>{},[criterios])

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
                        onClick={ () => {  setMostrarCriterios(true); setEditarCriterios(true);}}
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

     {
      editarCriterios?
     (
     <div className="flex items-col justify-between">
      <Button onPress={ ()=> {setEditarCriterios(false); if(!existenCriterios) {setMostrarCriterios(false)} }} className="py-6 text-base">
        <i className="pi pi-times"></i>Cancelar</Button>
      <Button onPress={existenCriterios?guardarModificaciones:crearListaCriterios} isDisabled={maximo<100?true:false} className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 mb-10 text-base"
                        >
       <i className="pi pi-save" style={{fontSize:"20px"}}></i> Guardar</Button>
     </div>
     )
     :
     (
      <div className="flex justify-between">
       <h2 className="text-3xl font-semibold ml-6 mt-1 mb-4">Criterios</h2>
       <Button onPress={()=> setEditarCriterios(true)} className=" text-base">
        <i className="pi pi-pencil"></i>
        Editar
       </Button>
      </div>
     )

     }
      <div>
      {criterios.map((item, index) => (
        <Card key={index} className="my-2">
          <CardBody>
            <div className="flex items-center justify-between font-medium text-xl ">
            {
             editarCriterios?
             (
              <div className="flex justify-between" style={{width:"100%"}} >
            
              <Input  type="text" onChange={(e) => {modificarCriterio(item.nombre, e.target.value)}} startContent={<button onClick={ ()=> { eliminarCriterio(item.nombre)}} className="mx-4"><MdDelete size="40px"/></button>} placeholder={item.nombre} className={{input:["w65 shadow-xl","text-white/90 dark:text-white/90 font-thin"],          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
          ],
}}/>
              <Input type="number" max={100 - maximo + item.ponderacion} min={0} onChange={ (e) => {modificarCriterio(item.nombre, e.target.value)}} endContent="%" value={item.ponderacion}></Input>
              
              </div>
              )
              :
              (
               <>
               <span className="ml-4">{item.nombre}</span> 
               <span>{item.ponderacion}%</span>
               </>
              )
              }
            </div>
          </CardBody>
        </Card>
      ))}

      {
       editarCriterios &&
       (
        <>
        <Card className="my-2">
          <CardBody>
           <div className="flex justify-end">
            <span className="mr-2 text-xl font-medium">Total:</span>
            <span className="text-xl font-medium">{maximo}%</span>
           </div>
          </CardBody>
        </Card>
        <div className="flex justify-end">  
       
                    <Button
                        radius="large"
                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-10 mt-3 mb-10 font-bold text-base"
                        onClick={controlModal.onOpen}
                        isDisabled={maximo<100?false:true}
                    >
                    <i className="pi pi-plus"></i> Agregar criterio
                    </Button>
        </div>
        </>
       )
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