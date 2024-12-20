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
  
  // Estructura para agrupar las fotos por número de auditoría
  const [groupedPhotos, setGroupedPhotos] = useState<Map<string, Photo[]>>(new Map());

  // Función para obtener las fotos desde la API
  const fetchIncidencias = async () => {
    try {
      const data = await obtenerFotos();
      const allPhotos = data.filter((item: Photo) => item.key.startsWith('photos/'));
      setPhotos(allPhotos);
      groupPhotosByAuditNumber(allPhotos);
    } catch (error) {
      console.error('Error al obtener las fotos:', error);
      setErrorMessage('Error al cargar las fotos.');
    }
  };

  // Función para agrupar las fotos por número de auditoría
  const groupPhotosByAuditNumber = (photos: Photo[]) => {
    const groups = new Map<string, Photo[]>();

    photos.forEach((photo) => {
      const auditNumber = extractAuditNumber(photo.key);
      if (!groups.has(auditNumber)) {
        groups.set(auditNumber, []);
      }
      groups.get(auditNumber)?.push(photo);
    });

    setGroupedPhotos(groups);
  };

  // Función para eliminar una foto
  const handleDelete = async (key: string) => {
    try {
      await eliminarFoto(key);
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.key !== key));
      groupPhotosByAuditNumber(photos.filter((photo) => photo.key !== key));
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
      setErrorMessage('Error al eliminar la foto.');
    }
  };

  // Extraer número de auditoría desde la key 
  const extractAuditNumber = (key: string) => {
    const regex = /photos\/([^_]+)_/;
    const match = key.match(regex);
    return match ? match[1] : 'N/A';
  };

  // Extraer el nombre de la foto desde la key 
  const extractPhotoName = (key: string) => {
    const regex = /photos\/[^_]+_([^_]+)_[^_]+\.png$/;
    const match = key.match(regex);
    return match ? match[1].replace(/_/g, ' ') : 'Nombre desconocido';
  };

  // Extraer la fecha de la foto desde la key 
  const extractPhotoDateFromUrl = (key: string) => {
    const regex = /photos\/[^_]+_[^_]+_(\d{8})\.png$/;
    const match = key.match(regex);
    if (match) {
      const dateStr = match[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    return 'Fecha desconocida';
  };


  useEffect(() => {
    fetchIncidencias();
  }, []);

  return (
    <div className="photos-backend-container">
      <h4>
        Incidencias Guardadas{' '}
        <span className="text-info">
          <i className="fa-solid fa-database"></i>
        </span>
      </h4>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      {/* Mostrar las fotos agrupadas por número de auditoría */}
      {Array.from(groupedPhotos.keys()).map((auditNumber) => (
        <div key={auditNumber} className="audit-group">
          <h5>Número de Auditoría: {auditNumber}</h5>
          <div className="photo-gallery">
            {groupedPhotos.get(auditNumber)?.map((photo) => (
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
      ))}
    </div>
  );
};

export default PhotosBackend;
