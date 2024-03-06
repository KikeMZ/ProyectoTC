import { IoMdNotificationsOutline } from "react-icons/io";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, AvatarIcon, User, Button } from "@nextui-org/react";
import { claseContext } from "../layouts/layoutProfesor";
import { useContext } from "react";


const profesor = new URLSearchParams(location.search).get('email');



export default function Header() {
  const {dataClase} = useContext(claseContext)
  console.log("datos de la clase"+dataClase)

    return (
        <header className="h-14 border-b border-gray-600 p-4 bg-transparent flex justify-between items-center">
            <div>
            <h1 className="text-center font-bold">{dataClase.nombreMateria}</h1>
            <div className="justify-between flex">
            <p className="text-start text-sm">{dataClase.nrc}</p>
            <p className="text-start text-sm">{dataClase.seccion}</p>
            </div>
            </div>
            <nav className="flex gap-4" >
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
                                description="Correo"
                                name={profesor}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions" variant="flat">
                            <DropdownItem key="logout" color="danger">
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </nav>
        </header>
    )
}