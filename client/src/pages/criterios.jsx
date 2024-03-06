import React, { useContext, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";



const Criterios = () => {

  const { showNav, shownav } = useContext(NavContext); 

    useEffect(() => {
        showNav();
    }, [])
    
    console.log(shownav)

  return (
    <div>Criterios</div>
  )
}

export default Criterios