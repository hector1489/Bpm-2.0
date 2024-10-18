import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com/details';

// crear múltiples registros en tabla_details
export const createTablaDetail = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/tabla-details`,  data );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al crear los registros:', error.message);
    } else {
      console.error('Error desconocido al crear los registros');
    }
    throw new Error('Error en la inserción de registros');
  }
};


export const getAllTablaDetailsNumbersAudit = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/auditorias`);

    if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('No data found or the response is not an array.');
      return [];
    }
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al obtener los detalles de la tabla:', error.message);
    } else {
      console.error('Error desconocido al obtener los detalles de la tabla');
    }
    throw new Error('No se pudieron recuperar los datos');
  }
};


export const getTablaDetailsByNumeroAuditoria = async (numero_auditoria: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/tabla-details/${numero_auditoria}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error al obtener los detalles para el número de auditoría ${numero_auditoria}:`, error.message);
    } else {
      console.error('Error desconocido al obtener los detalles de la tabla');
    }
    throw new Error('No se pudieron recuperar los datos para el número de auditoría proporcionado');
  }
};


export const deleteTablaDetail = async (numero_auditoria: string): Promise<any> => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleted-details/${numero_auditoria}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al eliminar los registros:', error.message);
    } else {
      console.error('Error desconocido al eliminar los registros');
    }
    throw new Error('No se pudieron eliminar los registros');
  }
};
