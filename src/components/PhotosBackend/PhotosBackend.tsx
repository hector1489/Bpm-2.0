import React, { useEffect, useState } from 'react';
import { obtenerFotos, eliminarFoto } from '../../utils/apiPhotosUtils';
import './PhotosBackend.css';

interface Photo {
  key: string;
  url: string;
}

const PhotosBackend: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Función para obtener todas las fotos
  const fetchIncidencias = async () => {
    try {
      const data = await obtenerFotos();
      setPhotos(data);
    } catch (error) {
      console.error('Error al obtener las fotos:', error);
      setErrorMessage('Error al cargar las fotos.');
    }
  };

  // Función para eliminar una foto
  const handleDelete = async (key: string) => {
    try {
      await eliminarFoto(key);
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.key !== key));
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
      setErrorMessage('Error al eliminar la foto.');
    }
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  return (
    <div className="photos-backend-container">
      <h4>Incidencias Guardadas <span className='text-info'><i className="fa-solid fa-database"></i></span></h4>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="photo-gallery">
        {photos.map((photo) => (
          <div className="photo-item" key={photo.key}>
            <img src={photo.url} alt="Imagen de Incidencia" />
            <button
              className="delete-photo-button"
              onClick={() => handleDelete(photo.key)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosBackend;
