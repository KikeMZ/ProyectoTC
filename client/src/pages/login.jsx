import LoginCard from "../components/loginCard"
import { useEffect } from "react";
import axios from "axios";



export default function Login(){


    useEffect(() =>{

        const pruebaEntregas = async () => {
         await axios.delete("http://127.0.0.1:8000/api/Entrega/borrarEntrega/",[{"profesor":2}]);
        } 
       
        pruebaEntregas();
       },[]);
       
    return(
        <div className="flex w-full h-screen">
            <div className="w-full flex items-center justify-center lg:w-1/2 ">
                <LoginCard></LoginCard>
            </div>
            <div className="hidden lg:flex h-full w-1/2 items-center justify-center">
                <b>Sistema de Control Escolar</b>
            </div>
        </div>
    )
}
