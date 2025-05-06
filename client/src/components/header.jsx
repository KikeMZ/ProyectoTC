import { IoMdNotificationsOutline } from "react-icons/io";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, AvatarIcon, User, Button } from "@nextui-org/react";
import { claseContext } from "../layouts/layoutProfesor";
import { useContext } from "react";
import { Link } from 'react-router-dom';
import { getProfesorByCorreo } from '../services/profesor.api'
import { jwtDecode } from "jwt-decode";

const obtenerNombreProfesor = async (correoProfesor) => {
 let res = await getProfesorByCorreo(correoProfesor);
 let nombre = res.data[0].nombre;
 console.log(nombre)
 return nombre;
} 

export default function Header() {
  const {dataClase} = useContext(claseContext)

  let datosProfesor = jwtDecode(window.localStorage.getItem("access_token"));
  const nombreProfesor = datosProfesor.nombre;
  const correo = datosProfesor.email;

    return (
        <header className="border-b border-gray-600 pb-4 py-2 bg-transparent flex flex-wrap items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start flex-grow">
                <h1 className="font-bold text-sm sm:text-base truncate w-full sm:w-auto">{dataClase.nombreMateria}</h1>
                <div className="flex gap-4 sm:ml-4 mt-1 sm:mt-0 w-full sm:w-auto">
                    <p className="text-start text-sm">{dataClase.nrc}</p>
                    <p className="text-start text-sm">{dataClase.seccion}</p>
                </div>
            </div>

            <nav className="flex gap-4 items-center justify-between w-full sm:w-auto" >
                <p className="italic">Profesor</p>
                <div className="flex gap-4 items-center">
                    <Button className="bg-secondary-900" radius="full" isIconOnly>
                        <IoMdNotificationsOutline className=" size-6 fill-white"/>
                    </Button>
                    <div className="flex items-center">
                        <Dropdown placement="bottom-start" className="bg-secondary-900">
                            <DropdownTrigger>
                                <User
                                    as="button"
                                    avatarProps={{
                                        isBordered: true,
                                        color:"primary",
                                        icon: <AvatarIcon/>
                                    }}
                                    className="transition-transform"
                                    description={correo}
                                    name={nombreProfesor}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="logout" color="danger">
                                <Link >
                                <button onClick={ () => { window.localStorage.removeItem("access_token"); window.localStorage.removeItem("refresh_token"); window.location.href="/"}}>
                                    Cerrar sesión
                                </button>
                                </Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                </div>
            </nav>
        </header>
    )
}

