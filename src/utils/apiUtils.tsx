import axios from 'axios';
import { getCurrentDate } from './utils';

const BASE_URL = 'https://bpm-backend.onrender.com';

// Función para obtener todas las acciones correctivas
export const obtenerTodasLasAccionesDesdeAPI = async (authToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/accion-correctivas`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Función para enviar datos de auditoría al backend
export const enviarDatosAuditoria = async (desviaciones: any, authToken: string) => {
  const desviacionData= desviaciones.map((desviacion: any) => {
    return {
      numeroRequerimiento: desviacion.numeroRequerimiento || '',
      preguntasAuditadas: desviacion.pregunta || '',
      desviacionOCriterio: desviacion.respuesta || '',
      tipoDeAccion: desviacion.tipoDeAccion || '',
      responsableProblema: desviacion.responsableDelProblema || '',
      local: desviacion.local || '',
      criticidad: desviacion.criticidad || '',
      accionesCorrectivas: desviacion.accionesCorrectivas || '' || 'N/A',
      fechaRecepcion: getCurrentDate() || desviacion.fechaRecepcionSolicitud || '',
      fechaSolucion: desviacion.fechaSolucionProgramada || '',
      estado: desviacion.estado || 'Abierto',
      fechaCambio: desviacion.fechaCambioEstado || '',
      contactoClientes: desviacion.contactoClientes || '',
      evidenciaFotografica: desviacion.evidenciaFotografica || '',
      detalleFoto: desviacion.detalleFoto || '',
      auditor: desviacion.auditor || '',
      correo: desviacion.email || '',
      fechaModificacion: desviacion.fechaUltimaModificacion || '',
      authToken: authToken || '',
    };
  });

  console.log('Datos enviados al backend:', desviacionData);

  try {
    const response = await axios.post(`${BASE_URL}/send-data`, desviacionData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error en el envío de datos al backend:', error);
    throw error;
  }
};

// Función para cargar desviaciones desde el backend
export const cargarDesviacionesDesdeBackend = async (authToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/desviaciones`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al recuperar las desviaciones:', error);
    return null;
  }
};
