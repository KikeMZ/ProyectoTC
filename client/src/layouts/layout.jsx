import { Outlet } from "react-router-dom"
import Sidebar from "../components/sidebarAdmin"
import Toast from "../components/toast"

import { useState } from "react";
import { HiMenu } from "react-icons/hi";


export default function Layout(){
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 scrollbar-hide relative">
            <Toast/>

            {/* Sidebar fijo en escritorio */}
            <div className="hidden xl:block xl:col-span-1">
            <Sidebar />
            </div>

            {/* Sidebar como overlay en móvil */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                {/* Fondo semitransparente */}
                <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setSidebarOpen(false)}
                />
                {/* Sidebar móvil */}
                <div className="relative w-64 bg-secondary-900 p-4 h-full z-50 overflow-y-auto">
                <Sidebar />
                </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="xl:col-span-5 bg-secondary-900 h-screen flex flex-col">

                {/* Botón de menú solo en móvil */}
                <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className="xl:hidden fixed top-4 left-4 z-50 bg-secondary-800 p-2 rounded-md shadow-md"
                >
                <HiMenu className="w-6 h-6 text-white" />
                </button>

                {/* Contenido: con padding superior en móvil para que no se tape */}
                <div className="flex-1 overflow-y-scroll scrollbar-hide p-4 bg-secondary-100 pt-14 xl:pt-4">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
