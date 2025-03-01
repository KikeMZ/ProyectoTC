import { createContext, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import SidebarAlumno from "../components/sidebarAlumno";
import HeaderAlumno from "../components/headerAlumno";
import {NavAlumno} from "../components/navbarAlumno";
import Toast from "../components/toast"
import {jwtDecode} from "jwt-decode";

export const NavContext = createContext();
export const claseContext = createContext();
export const alumnoContext = createContext();

const LayoutAlumno = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { nombre, correo } =  window.localStorage.getItem("access_token")
    //const nombre = new URLSearchParams(location.search).get('nombre');

    //Estados de la NavBar
    const [shownav, setshownav] = useState(false);
    const showNav = () => {
        setshownav(true);
    }
    const dontshowNav = () => {
        setshownav(false);
    }

    //Estados de una clase
    const [dataClase, setDataClase] = useState([]);
    const limpiarDatos = () => {
        setDataClase([]);
    }
    const asignarDatos = (datos) => {
        setDataClase(datos);
    }

    //Estados de un Profesor
    const [dataAlumno, setDataAlumno] = useState(correo);
    const limpiarAlumno = () =>{
        setDataAlumno("");
    }

    useEffect(() => {
     async function autenticacion () {
      let sesionUsuarioApp = window.localStorage.getItem("access_token");
      if(sesionUsuarioApp)
      {
       let alumno = jwtDecode(sesionUsuarioApp);
       //let res = await revisarEstadoSesion(profesor.id,profesor.token);
       console.log("Layout")
      // console.log(res)
      // if(res.data.estadoSesion!=0)
      //  navigate("/");
        setDataAlumno(alumno.nombre)
      }
      else
       navigate("/");
     }

     autenticacion();

    }
    ,[])

    
    return(
        <alumnoContext.Provider value={{dataAlumno, limpiarAlumno}}>
         <claseContext.Provider value={{dataClase, limpiarDatos, asignarDatos}}>
          <div className="flex h-screen overflow-hidden">
            <Toast></Toast>
            <SidebarAlumno/>
            <div className="flex flex-col flex-1 ">
                <HeaderAlumno/>
                {shownav && <NavAlumno clase={{dataClase}}/>}
                <div className="flex-1 overflow-y-auto px-4 pb-8">
                 <NavContext.Provider value={{shownav, showNav, dontshowNav}}>
                    <Outlet/>
                 </NavContext.Provider>
                </div>
            </div>
          </div>
         </claseContext.Provider>
        </alumnoContext.Provider>
    )


};

export default LayoutAlumno;