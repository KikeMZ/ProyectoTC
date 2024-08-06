import { useEffect, useState} from 'react';
import { Navigate, Outlet} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode';

export const ProtectedRouteAdmin = () => {

    const [ existeToken, setExisteToken ] = useState(false);
    const [ esAdministrador, setEsAdministrador ] = useState(false);

    const verificarEstadoLogin = () => {
     let token = window.localStorage.getItem("access_token");
     if(token)
     {
    //  setExisteToken(true);
      let {tipo_usuario} = jwtDecode(token);
      if(tipo_usuario!=0)
       return <Navigate to="/"/>
      //  setEsAdministrador(true);
    //  else
     }
     else
      return <Navigate to="/"/>
     return <Outlet/>;
    }

   // useEffect(()=>{
   //  console.log("P")
     verificarEstadoLogin()
   //  console.log("P3")
   // },[])

    //if(!existeToken || !esAdministrador) return(<Navigate to="/"/>)

    return(verificarEstadoLogin());

}