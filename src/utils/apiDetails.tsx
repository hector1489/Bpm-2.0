import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com';

// Función para crear un nuevo detalle en la tabla
export const createTablaDetail = async (data: any) => {

  try {
    const response = await axios.post(`${BASE_URL}/details/tabla-details`, data );
    return response.data;
  } catch (error) {
    console.error('Error al crear el detalle:', error);
    throw error;
  }
};
