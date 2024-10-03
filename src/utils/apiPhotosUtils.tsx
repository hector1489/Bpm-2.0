import axios from 'axios';

const BASE_URL = 'https://bpm-backend.onrender.com';

export const enviarImagen = async (imagenBase64: string) => {
  if (!imagenBase64 || !imagenBase64.startsWith('data:image')) {
    console.warn('Formato de imagen inválido o no presente');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('imagen', imagenBase64);

    const response = await axios.post(`${BASE_URL}/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data?.url || null;
  } catch (error) {
    console.error('Error al enviar la imagen:', error);
    return null;
  }
};

export const cargarImagenes = async (datos: any[]) => {
  const datosConImagenes = [];

  for (const dato of datos) {
    if (dato.evidenciaFotografica && dato.evidenciaFotografica.startsWith('data:image')) {
      const urlImagen = await enviarImagen(dato.evidenciaFotografica);

      if (urlImagen) {
        dato.evidenciaFotografica = urlImagen;
      } else {
        console.warn('No se pudo obtener la URL de la imagen, asignando vacío');
        dato.evidenciaFotografica = '';
      }
    } else {
      dato.evidenciaFotografica = '';
    }
    datosConImagenes.push(dato);
  }

  return datosConImagenes;
};
