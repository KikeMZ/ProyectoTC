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

//const nombreProfesor = new URLSearchParams(location.search).get('nombre') //?? jwtDecode(window.localStorage.getItem("access_token")??null)?.nombre ?? null;
//const correo = new URLSearchParams(location.search).get('email') //?? jwtDecode(window.localStorage.getItem("access_token")??null)?.correo ?? null;

//if(correo)
// nombreProfesor = correo;
//console.log(nombreProfesor)

export default function Header() {
  const {dataClase} = useContext(claseContext)

  let datosProfesor = jwtDecode(window.localStorage.getItem("access_token"));
  const nombreProfesor = datosProfesor.nombre;
  const correo = datosProfesor.email;

    return (
        <header className="h-14 border-b border-gray-600 p-4 bg-transparent flex items-center">
            <div>
            <h1 className="text-center font-bold">{dataClase.nombreMateria}</h1>
            <div className="justify-between flex">
            <p className="text-start text-sm">{dataClase.nrc}</p>
            <p className="text-start text-sm">{dataClase.seccion}</p>
            </div>
            </div>
            <nav className="flex gap-4 w-full justify-between items-center" >
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

