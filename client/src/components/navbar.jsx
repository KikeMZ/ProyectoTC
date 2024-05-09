import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerListaAlumnos } from "../services/inscripcion.api";
import { getCriteriosByNRC } from "../services/claseCriterio.api";



function NavLink({ to, text, active, onClick }) {
  return (
    <Link
      to={to}
      className={`flex-grow items-center justify-center px-2 py-1 rounded-full hover:bg-secondary-100 ${active ? "bg-primary-100" : ""}`}
      style={{ marginBottom: "8px", marginRight: "8px" }}
      onClick={onClick}
    >
      <div className="justify-center w-full">
        {text}
      </div>
    </Link>
  );
}

export const Nav = ({clase}) => {
  const [activeLink, setActiveLink] = useState("");
  const [mostrarEntregas, setMostrarEntregas] = useState(false);
  const [mostrarAsistencia, setMostrarAsistencia] = useState(false);

  console.log(clase);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect( () => {
   const existenAlumnos = async () => {
    let auxExistenAlumnos = false; 
    let res = await obtenerListaAlumnos(clase.nrc)
    if(res.length>0)
     auxExistenAlumnos = true;
    return auxExistenAlumnos;
    
   }
   
   const existenCriterios = async () => {
    let auxExistenCriterios = false;
    let res = await getCriteriosByNRC(clase.nrc);
    console.log(res.data);
    if(res.data.length>0)
     auxExistenCriterios = true;
    return auxExistenCriterios;
   }
   
   existenAlumnos().then( (resExistenAlumnos) => {
    if(resExistenAlumnos==true)
    {
     setMostrarAsistencia(true);
     existenCriterios().then( (resExistenCriterios) => {
      console.log("Alumnos:"+resExistenAlumnos+", Criterios:"+resExistenCriterios)
      if(resExistenCriterios==true && resExistenAlumnos==true)
       setMostrarEntregas(true)
     })
    }
   });
  },[]);

  return (
    <div className="bg-secondary-900 w-full p-1">
      <nav className="flex">
        <NavLink
          to="/profesor/alumnos"
          text="Alumnos"
          active={activeLink === "/profesor/alumnos"}
          onClick={() => handleLinkClick("/profesor/alumnos")}
        />

        {
       //  mostrarEntregas &&

         (
        <NavLink
          to="/profesor/entregas"
          text="Entregas"
          active={activeLink === "/profesor/entregas"}
          onClick={() => handleLinkClick("/profesor/entregas")}
        />
         ) 
        }
        <NavLink
          to="/profesor/criterios"
          text="Criterios"
          active={activeLink === "/profesor/criterios"}
          onClick={() => handleLinkClick("/profesor/criterios")}
        />

        {
        // mostrarAsistencia &&

         (
         <NavLink
          to="/profesor/asistencias"
          text="Asistencias"
          active={activeLink === "/profesor/asistencias"}
          onClick={() => handleLinkClick("/profesor/asistencias")}
         />
         )
        }     
      </nav>
    </div>
  );
}
