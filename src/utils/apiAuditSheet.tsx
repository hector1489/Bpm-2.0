import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com/audit';

// Crear un registro en audit_sheet
export const createAuditSheet = async (data: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/audit-sheet`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al crear el registro en audit_sheet:', error.message);
    } else {
      console.error('Error desconocido al crear el registro en audit_sheet');
    }
    throw new Error('Error en la inserción del registro');
  }
};

// Obtener todos los registros de audit_sheet
export const getAllAuditSheets = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('No se encontraron datos o la respuesta no es un array.');
      return [];
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al obtener los registros de audit_sheet:', error.message);
    } else {
      console.error('Error desconocido al obtener los registros de audit_sheet');
    }
    throw new Error('No se pudieron recuperar los datos');
  }
};

// Obtener registros por numero_auditoria
export const getAuditSheetByNumeroAuditoria = async (numero_auditoria: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${numero_auditoria}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error al obtener los registros para el número de auditoría ${numero_auditoria}:`, error.message);
    } else {
      console.error('Error desconocido al obtener los registros de audit_sheet');
    }
    throw new Error('No se pudieron recuperar los datos para el número de auditoría proporcionado');
  }
};

// Obtener registros por username
export const getAuditSheetByUsername = async (username: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/username/${username}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error al obtener los registros para el usuario ${username}:`, error.message);
    } else {
      console.error('Error desconocido al obtener los registros de audit_sheet');
    }
    throw new Error('No se pudieron recuperar los datos para el usuario proporcionado');
  }
};

// Eliminar un registro por numero_auditoria
export const deleteAuditSheet = async (numero_auditoria: string): Promise<any> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${numero_auditoria}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al eliminar el registro en audit_sheet:', error.message);
    } else {
      console.error('Error desconocido al eliminar el registro en audit_sheet');
    }
    throw new Error('No se pudo eliminar el registro');
  }
};

export const deleteAuditSheetById = async (id: string): Promise<any> => {
  try {
    const response = await axios.delete(`${BASE_URL}/deleted/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al eliminar el registro por id en audit_sheet:', error.message);
    } else {
      console.error('Error desconocido al eliminar el registro por id en audit_sheet');
    }
    throw new Error('No se pudo eliminar el registro por id');
  }
};









