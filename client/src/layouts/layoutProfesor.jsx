import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import Toast from "../components/toast"
import { Nav } from "../components/navbar"
import { useState, createContext } from "react"
import { autenticarProfesor } from "../services/profesor.api"


export const NavContext = createContext();
export const claseContext = createContext();
export const profesorContext = createContext();

export default function LayoutProfesor() {
    const location = useLocation();
    const navigate = useNavigate();
    const profesor = new URLSearchParams(location.search).get('email');
    const contrasena = new URLSearchParams(location.search).get('password');

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
    const [dataProfesor, setDataProfesor] = useState(profesor);
    const limpiarProfesor = () =>{
        setDataProfesor("");
    }

    useEffect(() => {
     async function autenticacion () {
      let res = await autenticarProfesor(profesor,contrasena);
      if(res.data.estadoSesion==0)
       setDataProfesor(res.data.nombre)
      else if(res.data.estadoSesion==1)
       navigate("/?estado=1");
      else
       navigate("/?estado=2");
     }

     autenticacion();

    }
    ,[])


    return (
        <profesorContext.Provider value={{dataProfesor, limpiarProfesor}}>
            <claseContext.Provider value={{ dataClase, limpiarDatos, asignarDatos }}>
                <div className="flex h-screen overflow-hidden">
                    <Toast></Toast>
                    <Sidebar />
                    <div className="flex flex-col flex-1">
                        <Header />
                        {shownav && <Nav clase={dataClase}/>}
                        <div className="flex-1 overflow-y-auto px-4 pb-8">
                            <NavContext.Provider value={{ shownav, showNav, dontshowNav }}>
                                <Outlet/>
                            </NavContext.Provider>
                        </div>
                    </div>
                </div>
            </claseContext.Provider>
        </profesorContext.Provider>
    )
}
