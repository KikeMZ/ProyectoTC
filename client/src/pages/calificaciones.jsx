import React, { useContext, useState, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import ModalCalificaciones from "../components/modalCalificaciones";
import { updateCalificacion } from "../services/calificacion.api"
import { getCalificacionesByEntrega } from "../services/calificacion.api";

import axios from "axios";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Input, Card, CardBody, Button, useDisclosure } from "@nextui-org/react";
import { IoIosArrowBack } from 'react-icons/io';
import toast from 'react-hot-toast';

const Calificaciones = ({nrc, entrega, mostrarVistaEntregas}) => {

  const { showNav, shownav } = useContext(NavContext);
  const controlModal = useDisclosure();


  const [archivoCalificaciones, setArchivoCalificaciones] = useState({"datos":"", "tipo":0});
  const [calificaciones, setCalificaciones] = useState(null);
  const [calificacionesExtraidas, setCalificacionesExtraidas] = useState([]);
  const [mostrarCalificacionesExtraidas, setMostrarCalificacionesExtraidas] = useState(false)
  const [editarCalificaciones, setEditarCalificaciones] = useState(false);
 
  useEffect(() => {

    const obtenerCalificaciones = async () => {
     let res = await getCalificacionesByEntrega(entrega.id);
     setCalificaciones(res.data);
    }

    obtenerCalificaciones();
    //console.log(getCalificacionesByEntrega(entrega.id)); 
  }, [mostrarCalificacionesExtraidas])

  const modificarCalificacion = (id_calificacion, valor) =>{
    let auxCalificaciones = calificaciones;
    let posicionCalificacion = calificaciones.findIndex( (c) => c.id==id_calificacion)
    console.log(auxCalificaciones[posicionCalificacion]);

    auxCalificaciones[posicionCalificacion].nota = parseFloat(valor);
    setCalificaciones(auxCalificaciones);
    setEditarCalificaciones(true);
  }
    

  

  //const nrc = "59069";

  //
  // ----------------------------------------------------
  // --- Estados de la variable 'resultadoExtraccion' ---
  // ----------------------------------------------------
  //
  // 0 => Indica que la extraccion se realizo correctamente.
  //
  // 1 => Indica que el archivo esta vacio
  //
  // 2 => Indica que el Excel tiene una estructura interna invalida.
  //
  // 3 => Indica que se ha seleccionado un archivo con un tipo diferente a Excel
  //
  // 4 => Indica que se intentando comenzar con el proceso de lectura del Excel sin tener algun archivo seleccionado.
  //
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);

  // Esta variable contiene los mensajes que aparecen en cada uno de los posibles escenarios identificados hasta el momento.
  const mensajesImportacionExcel = ["¡Se han extraido los datos del Excel exitosamente!",
                               "¡¡¡El archivo Excel esta vacio!!!",
                               "¡¡¡La estructura del documento no es valida!!!",
                               "¡¡¡El tipo de archivo no es valido!!!",
                               "¡Seleccione primero un archivo!",
                                 
                              ];
                              
  //
  // ---------------------------------------------------------------------------------
  //  Esta funcion detecta cuando se ha seleccionado un archivo mediante el formulario
  // ---------------------------------------------------------------------------------
  //
  const manejarArchivo = (e) =>{
    let archivoSeleccionado = e.target.files[0];

    if (archivoSeleccionado) {
      let tipoArchivo = archivoSeleccionado.type;
      console.log(tipoArchivo);
      if (tipoArchivo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") { // Validar que sea un archivo PDF
        let leerArchivo = new FileReader();
        leerArchivo.readAsArrayBuffer(archivoSeleccionado);
        leerArchivo.onload = (e) => {
          setArchivoCalificaciones({"datos":e.target.result,"tipo":1});
        };
      }
      else if(tipoArchivo === "text/csv")
      {
       Papa.parse(archivoSeleccionado, {
        complete: (res) => {
         setArchivoCalificaciones({"datos":res,"tipo":2});
        }
       })
       //setArchivoCalificaciones()
      }
      else
      {
       setResultadoExtraccion(3);
      } 

    }
  }

  
  //
  // ---------------------------------------------------------------------------------------------------------
  //  Esta funcion permite crear un arreglo de objetos (JSON) con las calificaciones encontradas dentro del 
  //  archivo de Excel que genera Teams para poder almacenarlas posteriormente en la base de datos.
  // ---------------------------------------------------------------------------------------------------------
  //

  const crearListaCalificaciones = async ( datosCalificaciones, posicionIdentificador, posicionNota, notaMaxima) => {
    let calificacionesEncontradas = [];
    let correo = "";
    let inscripciones = await axios.get("http://127.0.0.1:8000/api/Inscripcion/?search="+nrc);
    let listaAlumnos = inscripciones.data.map( (inscripcion) => inscripcion.alumno_detail);
    console.log(inscripciones)
    for(let d of datosCalificaciones)
    {
     let datosAlumno;
      if(archivoCalificaciones.tipo == 1)
      {
       correo = d.split(",")[posicionIdentificador.correo];
       datosAlumno = listaAlumnos.find( (alumno) => alumno.correo == correo)
      }
      else
      {
       
       let identificador = d.split(",")[posicionIdentificador.apellidos] + d.split(",")[posicionIdentificador.nombre]
       console.log("Apellidos:"+posicionIdentificador.apellidos+", Nombre:"+posicionIdentificador.nombre);
       datosAlumno = listaAlumnos.find( (alumno) => (alumno.apellidos + alumno.nombre) == identificador)
       
      }
      if(datosAlumno)
      {
       let nota = (parseFloat(d.split(",")[posicionNota]) * 10.0) / notaMaxima; 
       let calificacion = {
        "nota": nota,
        "matricula": datosAlumno.matricula,
        "id_entrega": entrega.id
       };
       calificacionesEncontradas.push(calificacion);
       console.log(calificacion)
      }
    }
    setCalificacionesExtraidas(calificacionesEncontradas);
    console.log(calificacionesEncontradas);

   }

   const actualizarCalificaciones = async () => {

    if(mostrarCalificacionesExtraidas)
    {
     for(let calificacion of calificacionesExtraidas )
     {
      let datosCalificacion = calificaciones.find( (c) => c.matricula == calificacion.matricula);
      console.log("Datos calificaciones encontradas:")
      console.log(datosCalificacion)
      console.log(await updateCalificacion(datosCalificacion.id, calificacion));
      setMostrarCalificacionesExtraidas(false);
      setEditarCalificaciones(false);
      
     }
    }
    else
    {
     for(let calificacion of calificaciones)
     {
      console.log(await updateCalificacion(calificacion.id, calificacion));
      setEditarCalificaciones(false);
    
     }
    }
    toast.success("¡Se han actualizado las calificaciones existosamente!");
   }

  const validarNombreEntrega = (contenidoArchivo) => {
   return contenidoArchivo.includes(entrega.nombre);
  }
  
  //
  // -----------------------------------------------------------------------------
  // Funcion la cual permite validar si la estructura interna del Excel es valida.
  // ------------------------------------------------------------------------------
  //
  //  ---------------
  //  ---Variables---
  //  ---------------
  //
  //  -------------------------------------------------------------------
  //   existeCorreo, existeNota, esValido -> Booleano
  //  -------------------------------------------------------------------
  //

  const validarEstructuraCalificaciones = (contenidoArchivo) => {
    const campoCorreo = /\w+\.\w+@alumno.buap.mx/g;
    const campoNombre = /Nombre/g;
    const campoApellidos = /Apellidos/g
    const campoNota = /(Puntos|Calificación),/g;

    let existeCorreo = contenidoArchivo.search(campoCorreo) != -1?true:false;
    let existeNombre = contenidoArchivo.search(campoNombre) != -1?true:false;
    let existenApellidos = contenidoArchivo.search(campoApellidos) != -1?true:false;
    let existeNota = contenidoArchivo.search(campoNota) != -1?true:false;
    console.log("Correo:"+existeCorreo+" Nota:"+existeNota); 
    let esValido = (existeCorreo || (existeNombre && existenApellidos)) && existeNota;
    return esValido;
 
   } 

  //
  // --------------------------------------------------------
  //  Funcion que permite la extraccion de los datos del Excel
  // --------------------------------------------------------
  //
  const leerArchivoCalificaciones = async (e) =>{
    //e.preventDefault();
    console.log("l")
    if(archivoCalificaciones!=null)
    { //Se verifica si el usuario ha seleccionado el archivo Excel.
      if(archivoCalificaciones.tipo == 1)
      {
       const workbook =  XLSX.read(archivoCalificaciones.datos, {type: 'buffer'});
       const worksheetName =  workbook.SheetNames[0];
       const worksheet =  workbook.Sheets[worksheetName];
       console.log(worksheet);
       console.log(XLSX.utils.sheet_to_csv(worksheet))
       const excelValido = validarEstructuraCalificaciones(XLSX.utils.sheet_to_csv(worksheet));
       const existeNombreEntrega = validarNombreEntrega(XLSX.utils.sheet_to_txt(worksheet));
       if(!excelValido)
       {
        setResultadoExtraccion(2);
       }
       else if(!existeNombreEntrega)
       {
        toast.error("¡El nombre de la entrega no coincide con alguna de las entregas que se encuentran dentro del archivo!")
       }
       else
       {
        let datosCalificaciones =  XLSX.utils.sheet_to_csv(worksheet, {RS:"#"});
        let auxCalificaciones = datosCalificaciones.split("#").filter( (fila) => fila.search(/[\d\w]/g)!= -1);
        auxCalificaciones.shift();
        let posicionIdentificador = {
         "correo":6
        };
        let posicionNota = 12;
        let posicionNotaMaxima = 13;
        let notaMaxima = auxCalificaciones[1].split(",")[13];
        auxCalificaciones.shift();
        auxCalificaciones.shift();
        crearListaCalificaciones(auxCalificaciones,posicionIdentificador,12,notaMaxima);
        setMostrarCalificacionesExtraidas(true);

        toast.success("¡Se han extraido los datos exitosamente!");
        setResultadoExtraccion(0); //Se indica que el proceso de extraccion se realizo correctamente.
       }
      }
      else
      {
       let contenidoArchivoCSV = Papa.unparse(archivoCalificaciones.datos)
       let archivoValido = validarEstructuraCalificaciones(contenidoArchivoCSV);
       let existeNombreEntrega = validarNombreEntrega(contenidoArchivoCSV);
       if(!archivoValido)
       {
        setResultadoExtraccion(2);
       }
       else if(!existeNombreEntrega)
       {
        toast.error("¡Calificaciones no encontradas!, verifica que el nombre de la entrega se igual a la que se encuentra en el archivo."); 
       }
       else
       {
        let posicionIdentificador = {
         "nombre": archivoCalificaciones.datos.data[0].findIndex( (columna) => columna=="Nombre"),
         "apellidos": archivoCalificaciones.datos.data[0].findIndex( (columna) => columna=="Apellidos")
        }

        let posicionNota = archivoCalificaciones.datos.data[0].findIndex( (columna) => columna==entrega.nombre);
        let notaMaxima = archivoCalificaciones.datos.data[2][posicionNota];
        let auxCalificaciones = Papa.unparse(archivoCalificaciones.datos, {newline:"#"}).split("#");
        crearListaCalificaciones(auxCalificaciones,posicionIdentificador,posicionNota,notaMaxima);
        setMostrarCalificacionesExtraidas(true);
   
       }
      }
    }
    else
    { //Si el usuario aun no ha seleccionado algun archivo, se asignara un valor igual a 4 al estado "resultadoExtraccion".
     setResultadoExtraccion(4);
    }
   }

   useEffect(()=>{},[calificaciones])


  return (
    <>

     <Button onClick={mostrarVistaEntregas} variant="faded" radius="large" startContent={<IoIosArrowBack size="23px"/>} className="text-base px-4"> Regresar a entregas</Button>
    <div className="flex justify-between">

    {
      !editarCalificaciones && !mostrarCalificacionesExtraidas &&
      (
       <>
       <h2 className="text-3xl font-semibold mt-5">Calificaciones para {entrega.nombre}</h2>
                    <Button
                        radius="large"

                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-5 ml-3 mb-10 font-bold text-base"
                        onClick={ () => {setEditarCalificaciones(true)}}
                    >
                        <i className="pi pi-pencil" style={{fontSize:"18px",fontWeight:"bold"}}></i> Modificar calificaciones
                    </Button>
      </>
      )
                    
    }
                    <Button
                        radius="large"

                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-5 ml-3 mb-10 font-bold text-base"
                        onClick={controlModal.onOpen}
                    >
                        <i className="pi pi-folder-open" style={{fontSize:"18px",fontWeight:"bold"}}></i> { mostrarCalificacionesExtraidas?"Cambiar archivo":"Importar calificaciones"}
                    </Button>
    </div>
    {
     mostrarCalificacionesExtraidas
     ? 
     (
      <>
                    <Button
                        radius="large"

                        className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 mb-10 font-bold text-base"
                        onClick={actualizarCalificaciones}
                    >
                        <i className="pi pi-folder-open" style={{fontSize:"18px",fontWeight:"bold"}}></i> Guardar calificaciones
                    </Button>
      
      <h2>Numero de calificaciones identificadas: {calificacionesExtraidas.length}</h2>
      <hr></hr>
      <br></br>
      {

      calificacionesExtraidas.map( (calificacion, index) => (
      <div key={index}>
       <div>Matricula: {calificacion.matricula} | Nota: {calificacion.nota}</div>      
      </div>
      ))
      
      }
      <br></br>
      <hr></hr>
      <h2>Numero de calificaciones no encontradas: {calificaciones.length - calificacionesExtraidas.length}</h2>

      </>
     )
     :

     (
      <>
      {
      editarCalificaciones &&
      (
      <>
      <Button
      radius="large"

      className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 mb-10 font-bold text-base"
      onClick={actualizarCalificaciones}
  >
      <i className="pi pi-save" style={{fontSize:"18px",fontWeight:"bold"}}></i> Guardar calificaciones
  </Button>
  </>
  )
      }
    {
     calificaciones?.map( (calificacion, index) => (
      
    <div key={calificacion.id}>
     <div>Matricula: {calificacion.matricula} | Nota: {calificacion.nota}</div>
     { editarCalificaciones &&

      (
      <>
        <Input type="number" max={10} min={0} onChange={ (e) => {modificarCalificacion(calificacion.id, e.target.value)}} endContent={"%"} placeholder={calificacion.nota}></Input>
      </>
      )
     }
    </div>
    )
    )
    }
    </>
    )
   }

   <ModalCalificaciones controlModal={controlModal} setMostrarCalificacionesExtraidas={setMostrarCalificacionesExtraidas} manejarArchivo={manejarArchivo} setArchivoCalificaciones={setArchivoCalificaciones} leerArchivoCalificaciones={leerArchivoCalificaciones}></ModalCalificaciones>
   </>
  )
}

export default Calificaciones;