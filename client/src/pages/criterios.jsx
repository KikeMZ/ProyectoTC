import React, { useContext, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";
import { Card, CardBody, Button } from "@nextui-org/react";

const Crit = [
  {"nombre": "Tareas", "ponderacion": 20},
  {"nombre": "Practicas", "ponderacion": 20},
  {"nombre": "Proyecto", "ponderacion": 20},
  {"nombre": "Examen", "ponderacion": 20},
  {"nombre": "Asistencia", "ponderacion": 20},
];




const Criterios = () => {

  const { showNav, shownav } = useContext(NavContext);

  useEffect(() => {
    showNav();
  }, [])

  console.log(shownav)

  return (
    <div>
      <Button>Editar</Button>
      <div>
      {Crit.map((item, index) => (
        <Card key={index} className="my-2">
          <CardBody>
            <div className="flex items-center justify-between">
              <span>{item.nombre}</span>
              <span>{item.ponderacion}%</span>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
    </div>
  )
}

export default Criterios