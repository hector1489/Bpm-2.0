import axios from 'axios';
import { getCurrentDate } from './utils';
import { DesviacionResponse } from '../interfaces/interfaces'

const BASE_URL = 'https://bpm-backend.onrender.com';


// Función para obtener todas las acciones correctivas
export const obtenerTodasLasAccionesDesdeAPI = async (authToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/questions/accion-correctivas`, {
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


export const enviarDatosAuditoria = async (desviaciones: any, authToken: string) => {
  const correo = 'bbpmauditorias@gmail.com';

  const desviacionesArray = Array.isArray(desviaciones) ? desviaciones : [desviaciones];

  const desviacionData = desviacionesArray.map((desviacion: any) => {

    return {
      numeroRequerimiento: desviacion.numeroRequerimiento || '',
      preguntasAuditadas: desviacion.pregunta || '',
      desviacionOCriterio: desviacion.respuesta || '',
      tipoDeAccion: desviacion.tipoDeAccion || '',
      responsableProblema: desviacion.responsableDelProblema || '',
      local: desviacion.nombreDelEstablecimiento || '',
      criticidad: desviacion.criticidad || '',
      accionesCorrectivas: desviacion.accionesCorrectivas || '',
      fechaRecepcionSolicitud: desviacion.fechaRecepcion || getCurrentDate() || null,
      fechaSolucionProgramada: desviacion.solucionProgramada || null,
      estado: desviacion.estado || 'Abierto',
      fechaCambioEstado: desviacion.fechaCambio || null,
      contactoClientes: desviacion.contactoClientes || '',
      evidenciaFotografica: desviacion.evidenciaFotografica || '',
      detalleFoto: desviacion.detalleFoto || '',
      auditor: desviacion.auditor || '',
      email: desviacion.email || correo || '',
      fechaUltimaModificacion: desviacion.fechaModificacion || null,
      authToken: authToken || '',
      isNew: !('data-id' in desviacion),
    };
  });

  try {
    const response = await axios.post(`${BASE_URL}/desviaciones/send-data`, desviacionData, {
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


export const cargarDesviacionesDesdeBackend = async (authToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/desviaciones/desviaciones`, {
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

export const actualizarDesviacionBackend = async (
  id: number,
  updatedData: DesviacionResponse,
  authToken: string
) => {
  const handleEmptyField = (field: any) => (field !== undefined && field !== null ? field : '');

  const formatDate = (fecha: string | null) => {
    if (!fecha) return null;
    const dateObj = new Date(fecha);
    return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split('T')[0];
  };

  const safeValues = {
    numeroRequerimiento: handleEmptyField(updatedData.numero_requerimiento),
    preguntasAuditadas: handleEmptyField(updatedData.preguntas_auditadas),
    desviacionOCriterio: handleEmptyField(updatedData.desviacion_o_criterio),
    tipoDeAccion: handleEmptyField(updatedData.tipo_de_accion) || 'N/A',
    responsableProblema: handleEmptyField(updatedData.responsable_problema),
    local: handleEmptyField(updatedData.local),
    criticidad: handleEmptyField(updatedData.criticidad),
    accionesCorrectivas: handleEmptyField(updatedData.acciones_correctivas) || 'N/A',
    fechaRecepcionSolicitud: formatDate(updatedData.fecha_recepcion_solicitud),
    fechaSolucionProgramada: formatDate(updatedData.fecha_solucion_programada),
    estado: handleEmptyField(updatedData.estado) || 'Abierto',
    fechaCambioEstado: formatDate(updatedData.fecha_cambio_estado),
    contactoClientes: handleEmptyField(updatedData.contacto_clientes),
    evidenciaFotografica: handleEmptyField(updatedData.evidencia_fotografica) || 'N/A',
    detalleFoto: handleEmptyField(updatedData.detalle_foto),
    auditor: handleEmptyField(updatedData.auditor),
    correo: handleEmptyField(updatedData.correo),
    fechaUltimaModificacion: formatDate(updatedData.fecha_ultima_modificacion),
    authToken: handleEmptyField(authToken),
  };

  console.log("Datos actualizados que se enviarán al backend:", safeValues);

  try {
    const response = await axios.put(`${BASE_URL}/desviaciones/desviaciones/${id}`, safeValues, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    // Log del resultado de la petición
    console.log(`Respuesta del backend para la desviación con ID ${id}:`, response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error al actualizar la desviación con ID ${id}:`, error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(`Error general al actualizar la desviación con ID ${id}:`, error.message);
    } else {
      console.error(`Error desconocido al actualizar la desviación con ID ${id}:`, error);
    }
    throw new Error('Error al actualizar la desviación en el backend');
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
    const response = await axios.get(`${BASE_URL}/desviaciones/desviaciones/auditor/${auditor}`, {
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


// Función para eliminar la fila
export const desviacionDelete = async (id: number, authToken: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/desviaciones/desviacionesDelete/${id}`, {
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


