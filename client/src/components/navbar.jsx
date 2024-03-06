import React, { useState } from "react";
import { Link } from "react-router-dom";



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

export const Nav = () => {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="bg-secondary-900 w-full p-1">
      <nav className="flex">
        <NavLink
          to="/profesor/alumnos"
          text="Alumnos"
          active={activeLink === "/profesor/alumnos"}
          onClick={() => handleLinkClick("/profesor/alumnos")}
        />
        <NavLink
          to="/profesor/entregas"
          text="Entregas"
          active={activeLink === "/profesor/entregas"}
          onClick={() => handleLinkClick("/profesor/entregas")}
        /> 
        <NavLink
          to="/profesor/criterios"
          text="Criterios"
          active={activeLink === "/profesor/criterios"}
          onClick={() => handleLinkClick("/profesor/criterios")}
        />
        <NavLink
          to="/profesor/asistencias"
          text="Asistencias"
          active={activeLink === "/profesor/asistencias"}
          onClick={() => handleLinkClick("/profesor/asistencias")}
        />     
      </nav>
    </div>
  );
}
