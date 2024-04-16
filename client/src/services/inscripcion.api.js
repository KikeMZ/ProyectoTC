import axios from 'axios';
  /*
     -------------------------------------------
     ----- CRUD para el modelo Inscripcion -----
     -------------------------------------------

  */

  // ------------
  // ---Create---
  // ------------

  // 1. Crear un registro para inscripcion

  export const crearInscripcion = (matricula, nrc) => {

    let inscripcion = {
      "clase": nrc,
      "alumno": matricula,
     };

    axios.post("http://150.230.40.105/api/v1/Inscripcion/", inscripcion).then(res => res.data);     
 }


  // 2. Crear varios registros para el modelo Inscripcion pasando la lista de alumnos y el nrc de la materia
  export const crearListaInscripcion = async (matriculas, nrc) => {
    console.log("In")
    const promesas = matriculas.map(matricula => {
        let inscripcion = {
            "clase": nrc,
            "alumno": matricula,
        };
        console.log("Inscripcion: "+matricula+", "+nrc+","+inscripcion);
        // Retorna la promesa de la solicitud POST
        return axios.post("http://150.230.40.105/api/v1/Inscripcion/", inscripcion);
    });
    // Retorna una promesa que se resuelve cuando todas las solicitudes POST han sido completadas
    return await Promise.all(promesas);
}


  // ----------
  // ---Read---
  // ----------

  // 1. Obtener todas los registros existentes de la tabla Inscripcion
  export const obtenerInscripciones = () => {
    axios.get("http://150.230.40.105/api/v1/Inscripcion/").then( res => 
    {
     console.log(res.data);
    });      
  }
  
  // 2. Obtener todos los registros cuyo nrc sea igual al de la clase buscada.
  export const obtenerListaAlumnos = async (nrc) => {
    const response = await axios.get("http://150.230.40.105/api/v1/Inscripcion/?search="+nrc);
    console.log(response.data);
    return response.data;
}



  // Update (Duda)
  export const actualizarInscripcion = () => {

  }

 