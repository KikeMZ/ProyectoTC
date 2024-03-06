import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js';



export async function extraerDatosMaterias(archivoPDF) {
  let listaClases = [];
  let numeroCampo = 0;
  let nrc = "NA";
  let clave;
  let materia;
  let seccion;
  let nombreProfesor;
  let archivoVacio = false;

  if (archivoPDF !== null) {
    const task = pdfjsLib.getDocument(archivoPDF);
    try {
      const pdf = await task.promise;

      for (let j = 1; j <= pdf.numPages; j++) {
        const page = await pdf.getPage(j);
        const contenido = await page.getTextContent();

        if (contenido.items.length <= 1) {
          archivoVacio = true;
        }

        contenido.items.forEach(function (item) {
          let elementoString = item.str;

          if (!isNaN(elementoString)) {
            let datoNumerico = parseInt(elementoString);
            if (datoNumerico !== parseInt(nrc)) {
              if ((Math.floor(Math.log10(datoNumerico)) + 1) == 5) {
                numeroCampo++;
              }
            }
          }
          switch (numeroCampo) {
            case 0:
              break;
            case 1:
              nrc = elementoString;
              numeroCampo++;
              break;
            case 2:
              if (elementoString !== " " && elementoString !== "") {
                clave = elementoString;
                numeroCampo++; 
              }
              break;
            case 3:
              if (elementoString !== " ") {
                if (/\d/.test(elementoString)) {
                  clave += elementoString;
                } else {
                  materia = elementoString;
                  numeroCampo++;
                }
              }
              break;
            case 4:
              if (elementoString !== " ") {
                if (/\d/.test(elementoString)) {
                  seccion = elementoString;
                  numeroCampo++;
                } else {
                  materia += elementoString;
                }
              }
              break;
            case 7:
              if (elementoString !== " " && elementoString !== "-") {
                if (/\d/.test(elementoString) == false) {
                  nombreProfesor = elementoString;
                  numeroCampo++;
                }
              }
              break;
            case 8:
              if (elementoString !== " ") {
                if (/\d/.test(elementoString)) {
                  seccion = seccion.replaceAll("O", "0");
                  nombreProfesor = nombreProfesor.replace("-", " ");
                  nombreProfesor = nombreProfesor.replace("", " ");
                  let clase = {
                    "nrc": nrc,
                    "clave": clave,
                    "seccion": seccion,
                    "nombreMateria": materia,
                    "nombreProfesor": nombreProfesor,
                  };
                  console.log(clase);
                  listaClases.push(clase);
                  numeroCampo = 0;
                } else {
                  nombreProfesor = nombreProfesor + elementoString;
                }
              }
              break;
            default:
              if (elementoString !== " ") {
                numeroCampo++;
              }
              break;
          }
        });
      }
      if (archivoVacio) {
        return { resultado: 1, clases: [] };
      } else if (nrc === "NA") {
        return { resultado: 2, clases: [] };
      } else {
        return { resultado: 0, clases: listaClases };
      }
    } catch (e) {
      console.log("!!!Error al intentar cargar el PDF!!!:", e);
      return { resultado: 3, clases: [] };
    }
  }
}
