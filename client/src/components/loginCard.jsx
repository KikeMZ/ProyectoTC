import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";


import {api} from "../services/axios.api";
import { autenticarAdministrador } from "../services/administrador.api";
import { autenticarProfesor } from "../services/profesor.api";
import toast from "react-hot-toast";

export default function LoginCard() {
  const [email, setEmail] = useState(""); // Estado para almacenar el valor del email
  const [contrasena, setContrasena] = useState("");

  const navigate = useNavigate();


  const limpiarTexto = (texto) => {
   return texto.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Actualizar el estado del email cuando cambia el valor del campo de entrada
  };
  console.log("Valor actual de email:", email);

  const handleContrasenaChange = (e) => {
    setContrasena(e.target.value); // Actualizar el estado del email cuando cambia el valor del campo de entrada
  };

  const comprobarTipoUsuario = () => {
   if(email.includes("@correo.buap.mx"))
    return 1; //Profesor
   else
    return 0; //Administrador;
  }

  const verificarDatosLogin = () => {

   let toastLoading = toast.loading("Verificando credenciales de acceso...");
   if(email!="" && contrasena!="")
   {
   
   let JSONUsuario = {
    "username": email ,
    "password": contrasena
   }
   autenticarAdministrador(JSONUsuario).then( res => {
    let tipoUsuario = comprobarTipoUsuario();
    window.localStorage.setItem("access_token", res.data.access);
    window.localStorage.setItem("refresh_token", res.data.refresh)
    api.defaults.headers['Authorization'] = 'JWT '+ window.localStorage.getItem('access_token');
    if(tipoUsuario==1)
    {
     let datosProfesor = jwtDecode(res.data.access);
     window.location.href = "/";
     //window.location.href = "/profesor?nombre="+datosProfesor.nombre+"&email="+datosProfesor.correo;


    }
   else
   {
    window.location.href = "/";
   }
  }).catch(e => {

    console.log(e.response.status);
    toast.dismiss(toastLoading);
    if(e.response.status === 401)
     toast.error("¡Credenciales incorrectas!, parece que de los datos ingresados son incorrectos.");    
    else
    
    toast.error("¡Ha ocurrido un problema al intentar iniciar sesion!, vuelva a pulsar el boton para reintentarlo.");
  });
  }
  else
  {
    toast.dismiss(toastLoading);
    toast.error("¡Debe llenar todos los campos para iniciar sesion!");
  }

  }

  
  return (
    <div className="bg-secondary-100 px-10 py-14 rounded-3xl">
      <h1 className="text-6xl font-semibold">Bienvenido</h1>
      <p className="font-medium text-lg text-gray-300 my-8">Ingrese sus datos:</p>
      <div className="mt-4 ">
        <Input
          type="text"
          label="Usuario"
          variant="bordered"
          color="primary"
          value={email} // Asignar el valor del email al campo de entrada
          onChange={handleEmailChange} // Manejar el cambio del valor del email
        />
      </div>
      <div className="mt-4">
        <Input onChange={handleContrasenaChange} type="password" label="Contraseña" variant="bordered" color="primary" />
      </div>
      <div className="flex justify-end items-center pt-8">
          <Button onClick={verificarDatosLogin} variant="fade" className="bg-gray-200 text-black text-base font-semibold">
            Iniciar sesion
          </Button>
      </div>
    </div>
  );
}
