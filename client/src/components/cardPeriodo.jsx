import React, { useContext } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
//import { claseContext } from "../layouts/layoutProfesor";

export default function PeriodoCard({ periodo }) {
  const { id, nombre, plan, estado, fecha_inicio, fecha_finalizacion } = periodo;
  //const {asignarDatos} = useContext(claseContext)

  const handleSelectPeriodo = () => {
    //asignarDatos(clase);
  };


  return (  
      <Card className="max-w-[400px] bg-gray-100">
        <Link to={`clases?periodo=${id}&nombre=${nombre}`} onClick={handleSelectPeriodo}>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-xl font-semibold">{nombre}</p>
            <p className="text-small font-medium text-default-500">{plan}</p>
          </div>
        </CardHeader>
        </Link>
        <Divider />
        <CardBody>
          <div className="flex justify-between items-center gap-5">
            <p className="text-small"> <span className=" font-medium">Inicio:</span> {fecha_inicio}</p>
            <p className="text-small"> <span className=" font-medium"> Cierre: </span> {fecha_finalizacion}</p>
          </div>
        </CardBody>
      </Card>
  );
}
