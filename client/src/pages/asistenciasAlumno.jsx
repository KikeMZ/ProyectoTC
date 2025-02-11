import { useEffect, useContext, useState } from 'react';
import { NavContext } from '../layouts/layoutAlumno';
import QRCode from 'qrcode'; // Importar la librería qrcode

export default function AsistenciasAlumno() {
    const { showNav } = useContext(NavContext);
    
    // Estado para la matrícula ingresada
    const [matricula, setMatricula] = useState("");
    
    // Estado para almacenar la imagen del QR en base64
    const [qrCodeImage, setQrCodeImage] = useState("");

    // Mostrar la barra de navegación
    useEffect(() => {
        showNav(true);
    }, [showNav]);

    // Manejar el cambio de la matrícula
    const handleInputChange = (e) => {
        setMatricula(e.target.value);
    };

    // Función para generar el código QR
    const generarQR = async () => {
        if (matricula) {
            try {
                // Generar el código QR y almacenarlo en el estado como una imagen base64
                const qrCodeData = await QRCode.toDataURL(matricula);
                setQrCodeImage(qrCodeData);
            } catch (err) {
                console.error("Error al generar el código QR", err);
            }
        } else {
            alert("Por favor, ingresa una matrícula válida.");
        }
    };

    return (
        <div className="flex flex-col h-full grow justify-center items-center">
            <h1 className="text-4xl font-semibold">Asistencia</h1>
            <h2 className="text-xl font-regular text-slate-300 mt-2 opacity-80">Ingresa tu matrícula</h2>
            
            {/* Input para la matrícula */}
            <input 
                type="text"
                value={matricula}
                onChange={handleInputChange}
                placeholder="Ingresa tu matrícula"
                className="mt-4 px-4 py-2 border rounded-md bg-black text-white" // Cambiar fondo a negro y texto a blanco
            />
            
            {/* Botón para generar el QR */}
            <button 
                onClick={generarQR}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md"
            >
                Generar QR
            </button>
            
            {/* Mostrar el QR si se ha generado */}
            {qrCodeImage && (
                <div className="mt-6">
                    <img 
                        src={qrCodeImage} 
                        alt="Código QR" 
                        style={{ width: '300px', height: '300px' }} // Aumentar el tamaño del QR
                    />
                </div>
            )}
        </div>
    );
}
