import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com/details';

// Función para crear múltiples registros en tabla_details
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

// Función para obtener todos los registros de tabla_details
export const getAllTablaDetails = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/tabla-details`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al obtener los detalles de la tabla:', error.message);
    } else {
      console.error('Error desconocido al obtener los detalles de la tabla');
    }
    throw new Error('No se pudieron recuperar los datos');
  }
};

// Función para eliminar un registro por número de auditoría en tabla_details
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
