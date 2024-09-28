
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

export const enviarDatosAuditoria = async (auditData: any) => {
  try {
    const response = await fetch('https://bpm-backend.onrender.com/send-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(auditData),
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

