import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import { IoTimeOutline } from "react-icons/io5";

// Componente de link para el sidebar
function NavLink({ to, icon: Icon, text, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-secondary-100 ${active ? "bg-primary-100" : ""}`}
      style={{ marginBottom: "8px" }}
    >
      <Icon />
      {text}
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-secondary-900 h-[100vh] overflow-y-scroll scrollbar-hide p-4">
      <h1 className="text-center text-2xl font-bold mb-2">BUAP</h1>
      <h3 className="text-center text-md italic mb-10">Administrador</h3>
      <div className="flex flex-col justify-end gap-4 ">
      <nav>
        <NavLink
          to="/admin"
          icon={FaChalkboardTeacher}
          text="Clases"
          active={currentPath === "/admin"}
        />

        <NavLink
          to="/admin/profesores"
          icon={IoIosSchool}
          text="Profesores"
          active={currentPath === "/admin/profesores"}
        />

      </nav>
      <Button onPress={ () => { window.localStorage.removeItem("access_token"); window.localStorage.removeItem("refresh_token");  window.location.href="/"}} className="text-black font-semibold">Cerrar Sesion</Button>
      </div>       
      </div>
  );
}
