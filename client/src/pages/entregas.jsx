import React, { useContext, useEffect } from "react";
import { NavContext } from "../layouts/layoutProfesor";



const Entregas = () => {

  const { showNav, shownav } = useContext(NavContext); 

    useEffect(() => {
        showNav();
    }, [])
    
    console.log(shownav)

    
  return (
    <div>Entregas 
    </div>
  )
}

export default Entregas