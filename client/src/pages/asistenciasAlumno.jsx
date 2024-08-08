import {useEffect, useContext} from 'react';
import {NavContext} from '../layouts/layoutAlumno';

export default function AsistenciasAlumno(){

    const { showNav } = useContext(NavContext)

    useEffect( () => {
     showNav(true)
    },[]);
    
    return(
        <div className="flex flex-col h-full grow justify-center items-center ">
         <h1 className="text-4xl font-semibold">Asistencia</h1>
         <h2 className="text-xl font-regular text-slate-300 mt-2 opacity-80">Seccion en construccion</h2>
        </div>
    )
}