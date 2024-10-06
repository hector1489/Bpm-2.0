import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com';

// Obtener todos los PDFs
export const obtenerPDFs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pdfs`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los PDFs:', error);
    throw error;
  }
};

// Función para subir un PDF
export const subirPDF = async (pdfFile: File, fileName: string) => {
  if (!pdfFile || pdfFile.type !== 'application/pdf') {
    console.warn('Archivo PDF inválido o no presente');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', pdfFile, fileName);

    const response = await axios.post(`${BASE_URL}/pdfs/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data?.url || null;
  } catch (error) {
    console.error('Error al subir el PDF:', error);
    return null;
  }
};

// Obtener un PDF por su clave (key)
export const obtenerPDFPorClave = async (key: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/pdfs/${key}`, {
      responseType: 'arraybuffer',
    });
    return `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
  } catch (error) {
    console.error('Error al obtener el PDF:', error);
    throw error;
  }
};

// Eliminar un PDF por su clave (key)
export const eliminarPDF = async (key: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/pdfs/${encodeURIComponent(key)}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el PDF:', error);
    throw error;
  }
};
