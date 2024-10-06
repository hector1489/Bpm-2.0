import axios from 'axios';
import { getCurrentDate } from './utils';
import { DesviacionResponse } from '../interfaces/interfaces'

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
    return {
    numeroRequerimiento: desviacion.numeroRequerimiento || '',
    preguntasAuditadas: desviacion.pregunta || '',
    desviacionOCriterio: desviacion.respuesta || '',
    tipoDeAccion: desviacion.tipoDeAccion || '',
    responsableProblema: desviacion.responsableDelProblema || '',
    local: desviacion.local || '',
    criticidad: desviacion.criticidad || '',
    accionesCorrectivas: desviacion.accionesCorrectivas || '' ,
    fechaRecepcion: desviacion.fechaRecepcionSolicitud || getCurrentDate() || null,
    fechaSolucion: desviacion.fechaSolucionProgramada || null,
    estado: desviacion.estado || 'Abierto',
    fechaCambio: desviacion.fechaCambioEstado || null,
    contactoClientes: desviacion.contactoClientes || '',
    evidenciaFotografica: desviacion.evidenciaFotografica || '',
    detalleFoto: desviacion.detalleFoto || '',
    auditor: desviacion.auditor || '',
    correo: desviacion.email || correo || '',
    fechaModificacion: desviacion.fechaUltimaModificacion || null,
    authToken: authToken || '',
    isNew: !('data-id' in desviacion)
    };
  });

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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al recuperar las desviaciones:', error);
    return null;
  }
};

export const actualizarDesviacionBackend = async (id: number, updatedData: DesviacionResponse, authToken: string) => {

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return null;
    const dateObj = new Date(fecha);
    return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split('T')[0];
  };

  const updateDesviacionData = {
    numeroRequerimiento: updatedData.numero_requerimiento || '',
    preguntasAuditadas: updatedData.preguntas_auditadas || '',
    desviacionOCriterio: updatedData.desviacion_o_criterio || '',
    tipoDeAccion: updatedData.tipo_de_accion || 'N/A',
    responsableProblema: updatedData.responsable_problema || '',
    local: updatedData.local || '',
    criticidad: updatedData.criticidad || '',
    accionesCorrectivas: updatedData.acciones_correctivas || 'N/A',
    fechaRecepcionSolicitud: updatedData.fecha_recepcion_solicitud ? formatFecha(updatedData.fecha_recepcion_solicitud) : null,
    fechaSolucionProgramada: updatedData.fecha_solucion_programada ? formatFecha(updatedData.fecha_solucion_programada) : null,
    estado: updatedData.estado || 'Abierto',
    fechaCambioEstado: updatedData.fecha_cambio_estado ? formatFecha(updatedData.fecha_cambio_estado) : null,
    contactoClientes: updatedData.contacto_clientes || '',
    evidenciaFotografica: updatedData.evidencia_fotografica || 'N/A',
    detalleFoto: updatedData.detalle_foto || '',
    auditor: updatedData.auditor || '',
    correo: updatedData.correo || '',
    fechaUltimaModificacion: updatedData.fecha_ultima_modificacion || null,
    authToken: authToken || '',
  };

  console.log('api utils', updateDesviacionData);

  try {
    const response = await axios.put(`${BASE_URL}/desviaciones/${id}`, updateDesviacionData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la desviación con ID ${id}:`, error);
    throw error;
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

// Función para eliminar la fila
export const desviacionDelete = async (id: number, authToken: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/desviacionesDelete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) {
      console.log('Desviación eliminada con éxito');
      return true;
    } else {
      throw new Error('Error al eliminar la desviación');
    }
  } catch (error) {
    console.error('Error al eliminar la desviación:', error);
    throw error;
  }
};


