import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import Toast from "../components/toast"
import { Nav } from "../components/navbar"
import { useState, createContext } from "react"


export const NavContext = createContext();
export const claseContext = createContext();
export const profesorContext = createContext();

export default function LayoutProfesor() {
    const location = useLocation();
    const profesor = new URLSearchParams(location.search).get('email');

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


    return (
        <profesorContext.Provider value={{dataProfesor, limpiarProfesor}}>
            <claseContext.Provider value={{ dataClase, limpiarDatos, asignarDatos }}>
                <div className="flex h-screen overflow-hidden">
                    <Toast></Toast>
                    <Sidebar />
                    <div className="flex flex-col flex-1">
                        <Header />
                        {shownav && <Nav />}
                        <div className="flex-1 overflow-y-auto px-4 py-1">
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
