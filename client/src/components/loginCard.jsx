import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function LoginCard() {
  const [email, setEmail] = useState(""); // Estado para almacenar el valor del email

  const handleEmailChange = (e) => {
    setEmail(e.target.value); // Actualizar el estado del email cuando cambia el valor del campo de entrada
  };
  console.log("Valor actual de email:", email);

  return (
    <div className="bg-secondary-100 px-10 py-14 rounded-3xl">
      <h1 className="text-6xl font-semibold">Bienvenido</h1>
      <p className="font-medium text-lg text-gray-300 my-8">Ingrese sus datos</p>
      <div className="mt-4 ">
        <Input
          type="email"
          label="Usuario"
          variant="bordered"
          color="primary"
          value={email} // Asignar el valor del email al campo de entrada
          onChange={handleEmailChange} // Manejar el cambio del valor del email
        />
      </div>
      <div className="mt-4">
        <Input type="password" label="Contraseña" variant="bordered" color="primary" />
      </div>
      <div className="flex justify-between items-center pt-8">
        <Link to="/admin">
          <Button variant="solid" className="bg-gray-300">
            Admin
          </Button>
        </Link>
        <Link to={`/profesor?email=${email}`}>
          <Button variant="solid" className="bg-gray-300">
            Profesor
          </Button>
        </Link>
      </div>
    </div>
  );
}
