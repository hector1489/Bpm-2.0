import { useEffect, useState } from 'react';
import { obtenerFotos, eliminarFoto } from '../../utils/apiPhotosUtils';
import './PhotosBackend.css';

interface Photo {
  key: string;
  url: string;
}

const PhotosBackend: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchIncidencias = async () => {
    try {
      const data = await obtenerFotos();
      // Ya no se filtran fotos, se muestran todas las obtenidas
      const allPhotos = data.filter((item: Photo) => item.key.startsWith('photos/'));
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Error al obtener las fotos:', error);
      setErrorMessage('Error al cargar las fotos.');
    }
  };

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

  const extractAuditNumber = (key: string) => {
    const regex = /photos\/[^_]+_([^_]+)_/;
    const match = key.match(regex);
    return match ? match[1] : 'N/A';
  }; 

  const extractPhotoName = (key: string) => {
    const regex = /photos\/[^_]+_[^_]+_(.+)\.png$/;
    const match = key.match(regex);
    if (match) {
      const fullText = match[1].replace(/_/g, ' ');
      const truncatedText = fullText.split(' ').slice(0, 2).join(' ');
      return truncatedText;
    }
    return key;
  };

  console.log(photos);

  const extractPhotoDateFromUrl = (url: string) => {
    const regex = /X-Amz-Date=(\d{8})T/;
    const match = url.match(regex);

    if (match) {
      const dateStr = match[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${day}/${month}/${year}`;
    }

    return 'Fecha desconocida';
  };


  return (
    <div className="photos-backend-container">
      <h4>
        Incidencias Guardadas{' '}
        <span className="text-info">
          <i className="fa-solid fa-database"></i>
        </span>
      </h4>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="photo-gallery">
        {photos.map((photo) => (
          <div className="photo-item" key={photo.key}>
            <img src={photo.url} alt="Imagen de Incidencia" />
            <p>Número de Auditoría: {extractAuditNumber(photo.key)}</p>
            <p>Fecha: {extractPhotoDateFromUrl(photo.url)}</p>
            <p>Pregunta: {extractPhotoName(photo.key)}</p>

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
