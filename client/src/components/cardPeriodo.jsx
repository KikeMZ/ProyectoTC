import React, { useContext } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { Link } from "react-router-dom";
//import { claseContext } from "../layouts/layoutProfesor";

export default function PeriodoCard({ periodo, modoEdicion, editarPeriodo }) {
  const { id, nombre, plan, estado, fecha_inicio, fecha_finalizacion } = periodo;
  //const {asignarDatos} = useContext(claseContext)

  const handleSelectPeriodo = () => {
    //asignarDatos(clase);
  };


  if(modoEdicion) return(

    <Card className="max-w-[400px] bg-gray-100 hover:animate-pulse cursor-pointer" onClick={() =>{ editarPeriodo(periodo)}}>
    <CardHeader className="flex gap-3" onClick={ () => {editarPeriodo(periodo)}}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center">
         <p className="text-xl font-semibold">{nombre}</p>

         {
          modoEdicion &&
          (
          <p className="text-sm text-default-500">Editar</p>
          )
         }
         
        </div>
        <p className="text-small font-medium text-default-500">{plan}</p>
      </div>
    </CardHeader>
    <Divider />
        <CardBody onClick={ () => {editarPeriodo(periodo)}}>
          <div className="flex justify-between items-center gap-5">
            <p className="text-small"> <span className=" font-medium">Inicio:</span> {fecha_inicio}</p>
            <p className="text-small"> <span className=" font-medium"> Cierre: </span> {fecha_finalizacion}</p>
          </div>
        </CardBody>
  </Card>

  );

  
  return (  
      <Card className="max-w-[400px] bg-gray-100 hover:animate-pulse">
        <Link to={`clases?periodo=${id}&nombre=${nombre}`} onClick={handleSelectPeriodo}>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
             <p className="text-xl font-semibold">{nombre}</p>

             {
              modoEdicion &&
              (
              <p className="text-sm text-default-500">Editar</p>
              )
             }
             
            </div>
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
