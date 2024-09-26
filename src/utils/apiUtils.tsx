
export const obtenerTodasLasAccionesDesdeAPI = async () => {
  try {
    const response = await fetch('https://bpm-backend.onrender.com/accion-correctivas');
    if (!response.ok) {
      throw new Error('Error al obtener datos de la API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
