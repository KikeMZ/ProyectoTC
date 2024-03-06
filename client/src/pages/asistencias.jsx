import React, { useContext, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";



const Asistencias = () => {

  const { showNav, shownav } = useContext(NavContext);

  useEffect(() => {
    showNav();
  }, [])

  console.log(shownav)

  return (
    <div>Asistencias</div>
  )
}

export default Asistencias 