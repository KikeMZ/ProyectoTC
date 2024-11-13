import LoginCard from "../components/loginCard"
import {Navigate} from "react-router-dom";

import {jwtDecode} from "jwt-decode";

export default function Login(){

    let token = window.localStorage.getItem("access_token") ?? null;

    const cargarVista = () =>{
     let usuario = jwtDecode(token);
     let direccionVista = "";
     switch(usuario.tipo_usuario)
     {
        case 0: direccionVista = "/admin"
                break;
        case 1: direccionVista = `/profesor?nombre=${usuario.nombre}&email=${usuario.correo}`;
                break;
        case 2: direccionVista = `/alumno`
                break;
     }
     return <Navigate to={direccionVista}/>

    }

    const sesionActiva = () => token!=null?true:false;

    if(sesionActiva()) return(cargarVista())


    return(
        <div className="flex w-full h-screen">
            <div className="w-full flex items-center justify-center lg:w-1/2 ">
                <LoginCard></LoginCard>
            </div>
            <div className="flex-col hidden lg:flex h-full w-1/2 items-center justify-center">
                <b className="text-3xl">Sistema de Control Escolar 2</b>
                <div className="text-base mt-3 w-9/12">Para ingresar al sistema, coloque su correo institucional como usuario y la contraseña enviada a su correo.</div>
            </div>
        </div>
    )
}
