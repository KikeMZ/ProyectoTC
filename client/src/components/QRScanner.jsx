import React, { useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = ({ onScan }) => {
  const [result, setResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false); // Controla la cámara
  const codeReader = useRef(null); // Usamos ref para guardar la instancia de codeReader
  const videoRef = useRef(null);

  const toggleCamera = () => {
    if (!isCameraActive) {
      // Iniciar cámara
      codeReader.current = new BrowserMultiFormatReader();
      codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
        if (result) {
          setResult(result.text);
          if (onScan) {
            onScan(result.text); // Llama a la función onScan con el resultado del escaneo
          }
        }
        if (error) {
          console.error(error);
        }
      });
    } else {
      // Detener cámara
      if (codeReader.current) {
        codeReader.current.reset(); // Detener el escáner
      }
    }

    setIsCameraActive(!isCameraActive); // Alternar estado de la cámara
  };

  return (
    <div>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
        onClick={toggleCamera}
      >
        {isCameraActive ? 'Desactivar Cámara' : 'Iniciar Cámara'}
      </button>

      {/* Mostrar u ocultar el video basado en isCameraActive */}
      <div className="mt-4">
        <video 
          ref={videoRef} 
          style={{ 
            width: '100%', 
            display: isCameraActive ? 'block' : 'none' // Mostrar u ocultar el video
          }} 
        />
      </div>
    </div>
  );
};

export default QRScanner;
