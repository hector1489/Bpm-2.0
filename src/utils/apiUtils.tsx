
const BASE_URL = 'https://bpm-backend.onrender.com';

// Función para obtener todas las acciones correctivas
export const obtenerTodasLasAccionesDesdeAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/accion-correctivas`);
    if (!response.ok) {
      throw new Error('Error al obtener datos de la API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Función para enviar datos de auditoría al backend
export const enviarDatosAuditoria = async (desviaciones: any) => {
  try {
    const response = await fetch(`${BASE_URL}/send-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(desviaciones),
    });

    if (!response.ok) {
      throw new Error('Error en el envío de datos al backend');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Función para cargar desviaciones desde el backend
export const cargarDesviacionesDesdeBackend = async () => {
  try {
    const response = await fetch(`${BASE_URL}/desviaciones`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al recuperar las desviaciones');
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
