import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com';

// Obtener todas las fotos
export const obtenerFotos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/photos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las fotos:', error);
    throw error;
  }
};

// Función para convertir Base64 a Blob
const base64ToBlob = (base64: string, contentType = 'image/png') => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

// Función para subir la foto
export const subirFoto = async (imagenBase64: string) => {
  if (!imagenBase64 || !imagenBase64.startsWith('data:image')) {
    console.warn('Formato de imagen inválido o no presente');
    return null;
  }

  try {
    const formData = new FormData();
    
    const imageBlob = base64ToBlob(imagenBase64);
    
    formData.append('image', imageBlob, 'photo.png');

    const response = await axios.post(`${BASE_URL}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.data?.url || null;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return null;
  }
};

// Obtener una foto por su clave (key)
export const obtenerFotoPorClave = async (key: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/photos/${key}`, {
      responseType: 'arraybuffer',
    });
    return `data:${response.headers['content-type']};base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
  } catch (error) {
    console.error('Error al obtener la foto:', error);
    throw error;
  }
};

// Eliminar una foto por su clave (key)
export const eliminarFoto = async (key: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete-photos/${encodeURIComponent(key)}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la foto:', error);
    throw error;
  }
};
