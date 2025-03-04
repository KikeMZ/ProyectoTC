import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function ImportacionAlumnos() {
  const [archivoExcel, setArchivoExcel] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [resultadoExtraccion, setResultadoExtraccion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const mensajesImportacionExcel = [
    "¡Se han importado los datos del Excel exitosamente!",
    "¡¡¡El archivo Excel está vacío!!!",
    "¡¡¡La estructura del documento no es válida!!!",
    "¡¡¡El tipo de archivo no es válido!!!",
    "¡Seleccione primero un archivo!",
  ];

  const manejarArchivo = (e) => {
    let archivoSeleccionado = e.target.files[0];

    if (archivoSeleccionado) {
      let tipoArchivo = archivoSeleccionado.type;

      if (tipoArchivo === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        let leerArchivo = new FileReader();
        leerArchivo.readAsArrayBuffer(archivoSeleccionado);
        leerArchivo.onload = (e) => {
          setArchivoExcel(e.target.result);
        };
      } else {
        setResultadoExtraccion(3);
      }
    }
  };

  const leerExcel = async (e) => {
    e.preventDefault();

    if (!archivoExcel) {
      setResultadoExtraccion(4);
      return;
    }

    setIsLoading(true);
    setProgress(10);

    try {
      const workbook = await XLSX.read(archivoExcel, { type: "buffer" });
      setProgress(40);
      if (!workbook.SheetNames.length) throw new Error("Archivo vacío");

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      if (!worksheet) throw new Error("Estructura no válida");

      let datosAlumnos = XLSX.utils.sheet_to_json(worksheet);
      setProgress(70);
      if (!datosAlumnos.length) throw new Error("Sin datos");

      let listaAlumnos = datosAlumnos.map((alumno) => ({
        matricula: alumno.ID || "N/A",
        nombre: alumno["Nombre de Alumno"]?.split(",")[1]?.trim() || "Desconocido",
        correo: alumno.Email || "sin-correo@example.com",
      }));

      setAlumnos(listaAlumnos);
      await guardarAlumnos(listaAlumnos);
      setProgress(100);
      setResultadoExtraccion(0);
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      setResultadoExtraccion(2);
    }

    setIsLoading(false);
    setTimeout(() => setProgress(0), 500);
  };

  const guardarAlumnos = async (listaAlumnos) => {
    try {
      const response = await axios.post("http://tu-api.com/api/alumnos", { alumnos: listaAlumnos });
      console.log("Datos guardados:", response.data);
      alert("Los datos se guardaron correctamente");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Ocurrió un error al guardar los datos");
    }
  };

  return (
    <div>
      <h2>Importar Alumnos</h2>
      <input type="file" accept=".xlsx" onChange={manejarArchivo} />
      <button onClick={leerExcel} disabled={isLoading}>
        {isLoading ? <div className="spinner-large"></div> : "Importar Excel"}
      </button>
      {isLoading && <ProgressBar progress={progress} />}

      {resultadoExtraccion !== -1 && <p>{mensajesImportacionExcel[resultadoExtraccion]}</p>}

      {alumnos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nombre</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno, index) => (
              <tr key={index}>
                <td>{alumno.matricula}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style jsx>{`
        .spinner-large {
          width: 32px;
          height: 32px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #09f;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
          margin-top: 10px;
        }

        .progress {
          height: 100%;
          background-color: #09f;
          transition: width 0.3s ease-in-out;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const ProgressBar = ({ progress }) => (
  <div className="progress-bar">
    <div
      className="progress"
      style={{
        width: `${progress}%`,
        transition: "width 0.3s ease-in-out",
      }}
    ></div>
  </div>
);

export default ImportacionAlumnos;
