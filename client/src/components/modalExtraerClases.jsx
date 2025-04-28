import React, { useState } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalContent, ModalFooter,
  Button
} from "@nextui-org/react";
import { MdOutlineLibraryAdd } from "react-icons/md";

export default function ModalExtraerClases({ controlModal, onManejarArchivo, extraerClases }) {
  const [mensajeArchivo, setMensajeArchivo] = useState("");
  const [esArchivoValido, setEsArchivoValido] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const esPDF = archivo.type === "application/pdf";
      if (esPDF) {
        setMensajeArchivo("Archivo compatible");
        setEsArchivoValido(true);
      } else {
        setMensajeArchivo("Solo se permiten archivos PDF");
        setEsArchivoValido(false);
      }
    } else {
      setMensajeArchivo("");
      setEsArchivoValido(null);
    }

    onManejarArchivo(e);
  };

  const limpiarYcerrar = () => {
    setMensajeArchivo("");
    setEsArchivoValido(null);
    setCargando(false);
    controlModal.onClose();
  };

  const manejarExtraerClases = async () => {
    setCargando(true);
    try {
      await extraerClases(); // Puede mostrar progreso real si lo adapta
      setTimeout(() => {
        limpiarYcerrar();
      }, 500); // Breve retardo para ver la animación antes de cerrar
    } catch (error) {
      console.error("Error al extraer clases:", error);
      setCargando(false);
    }
  };

  return (
    <Modal
      isDismissable={false}
      classNames={{ closeButton: "text-foreground-white text-2xl hover:bg-black active:text-black" }}
      isOpen={controlModal.isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) limpiarYcerrar();
        controlModal.onOpenChange(isOpen);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="bg-gradient-to-tr from-primary-100 to-primary-200 text-xl text-white font-bold">
              <MdOutlineLibraryAdd size="28px" className="mr-2" />
              Importar clases
            </ModalHeader>

            <ModalBody className="gap-1 text-black">
              <label htmlFor="cargar" className="text-xl font-semibold my-2">
                Seleccione su archivo:
              </label>

              <input
                type="file"
                accept=".pdf"
                id="cargar"
                name="archivo"
                onChange={manejarCambioArchivo}
              />

              {mensajeArchivo && (
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: esArchivoValido ? "green" : "red"
                  }}
                >
                  {mensajeArchivo}
                </label>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-col">
              <div className="flex gap-4">
                <Button
                  color="danger"
                  style={{ fontWeight: "bold" }}
                  className="px-12 py-6 mt-2"
                  onPress={limpiarYcerrar}
                  isDisabled={cargando}
                >
                  Cancelar
                </Button>
                <Button
                  radius="large"
                  className="bg-gradient-to-tr from-primary-100 to-primary-200 text-white py-6 mt-2 ml-3 font-bold text-base"
                  onClick={manejarExtraerClases}
                  isDisabled={!esArchivoValido || cargando}
                >
                  <i className="pi pi-folder-open mr-2" style={{ fontSize: "18px", fontWeight: "bold" }}></i>
                  Extraer datos
                </Button>
              </div>

              {cargando && (
                <span className="mt-3 text-primary-500 font-medium animate-pulse">
                  Extrayendo datos<span className="animate-bounce">...</span>
                </span>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
