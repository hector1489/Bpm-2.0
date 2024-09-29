import axios from 'axios';

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

  const datosConFormatoCorrecto = desviaciones.map((desviacion: any) => {
    return {
      numeroRequerimiento: desviacion.numeroRequerimiento || '',
      pregunta: desviacion.pregunta || '',
      respuesta: desviacion.respuesta || 'Sin respuesta',
      fecha: desviacion.fecha || '',
      auditor: desviacion.auditor || '',
      email: desviacion.email || '',
      nombreEstablecimiento: desviacion.nombreEstablecimiento || '',
      responsableDelProblema: desviacion.responsableDelProblema || '',
      solucionProgramada: desviacion.solucionProgramada || '',
      accionesCorrectivas: desviacion.accionesCorrectivas || '',
      estado: desviacion.estado || 'Abierto',
      photoUrl: desviacion.photoUrl || 'N/A'
    };
  });

  try {
    const response = await axios.post(`${BASE_URL}/send-data`, datosConFormatoCorrecto, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
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
