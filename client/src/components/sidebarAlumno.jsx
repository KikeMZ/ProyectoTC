import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";


export default function SidebarAlumno() {
  const menus = [
    { name: "Clases", link: "/alumno", icon: FaChalkboardTeacher },
    //{ name: "Historico", link: "/profesor/historico", icon: IoTimeOutline },
  ];

  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("clases")

  return (
    <section className="relative">
      <div
        className={`absolute top-0 left-0 bg-secondary-100 min-h-screen ${open ? "w-48" : "w-20"} duration-300 text-gray-100 px-4 z-20`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={24}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4  relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${menu?.margin && "mt-5"
                } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md ${activeLink=="clases"?"bg-primary-100":""}`}
            >
              <div>{React.createElement(menu?.icon, { size: "24" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 1}00ms`,
                }}
                className={`whitespace-pre duration-100 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
