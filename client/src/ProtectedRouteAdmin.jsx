import { useEffect, useState} from 'react';
import { Navigate, Outlet} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode';

export const ProtectedRouteAdmin = () => {

    const verificarEstadoLogin = () => {
     let token = window.localStorage.getItem("access_token");
     if(token)
     {
      let {tipo_usuario} = jwtDecode(token);
      if(tipo_usuario!=0)
       return <Navigate to="/"/>
     }
     else
      return <Navigate to="/"/>
     return <Outlet/>;
    }

    return(verificarEstadoLogin());

}