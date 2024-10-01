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
  const correo = 'bbpmauditorias@gmail.com'


  const desviacionData= desviaciones.map((desviacion: any) => {
    console.log(desviacion);
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
      correo: desviacion.email || correo || '',
      fechaModificacion: desviacion.fechaUltimaModificacion || '',
      authToken: authToken || '',
      isNew: !('data-id' in desviacion)
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

// Función para cargar desviaciones por auditor
export const cargarDatosPorAuditor = async (auditor: string, authToken: string) => {

  if (!auditor) {
    console.error('Nombre del auditor no especificado.');
    return;
  }

  if (!authToken) {
    console.error('Token de autenticación no disponible.');
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}/desviaciones/auditor/${auditor}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    const datos = response.data;

    if (datos && datos.length > 0) {
      return datos;
    } else {
      alert('No se encontraron desviaciones en la base de datos para el auditor especificado.');
      return [];
    }
  } catch (error) {
    console.error('Error al recuperar las desviaciones:', error);
    alert('Ocurrió un error al recuperar las desviaciones.');
    return [];
  }
};


// Función para crear un nuevo detalle de la tabla
export const crearDetalleTabla = async (
  columna1: string,
  columna2: string,
  columna3: string,
  columna4: string,
  authToken: string
) => {
  console.log('Parametros de entrada para crearDetalleTabla:', {
    columna1,
    columna2,
    columna3,
    columna4,
    authToken,
  });

  if (!authToken) {
    console.error('Error: authToken is missing.');
    throw new Error('Authentication token is required.');
  }

  if (!columna1 || !columna2 || !columna3 || !columna4) {
    console.error('Error: Missing required parameters.');
    throw new Error('All parameters are required.');
  }

  try {
    const url = `${BASE_URL}/tabla-details`;
    console.log('Enviando solicitud POST a:', url);

    const response = await axios.post(url, {
      columna1,
      columna2,
      columna3,
      columna4,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    console.log('Nuevo detalle creado:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al crear el detalle de la tabla:', error.message);
      if (error.response) {
        console.error('Respuesta del error:', error.response.data);
        console.error('Código de estado del error:', error.response.status);
      } else {
        console.error('Error de red o timeout:', error.message);
      }
    } else {
      console.error('Error inesperado:', error);
    }
    
    throw error;
  }
};




// Función para obtener todos los detalles de la tabla
export const obtenerDetallesTabla = async (authToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/tabla-details`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    console.log('Detalles de la tabla recuperados:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los detalles de la tabla:', error);
    throw error;
  }
};





