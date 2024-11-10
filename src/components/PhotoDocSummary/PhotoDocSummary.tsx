import './PhotoDocSummary.css';
import { useEffect, useState } from 'react';
import { obtenerFotos, eliminarFoto } from '../../utils/apiPhotosUtils';

interface Photo {
  key: string;
  url: string;
}

interface PhotoDocSummaryProps {
  numeroAuditoria: string | undefined;
}

const PhotoDocSummary: React.FC<PhotoDocSummaryProps> = ({ numeroAuditoria }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchIncidencias = async () => {
    try {
      const data = await obtenerFotos();
  
      let filteredPhotos: Photo[] = [];
  
      if (numeroAuditoria) {
        filteredPhotos = data.filter((item: Photo) => {
          const auditNumber = extractAuditNumber(item.key);
          return auditNumber === numeroAuditoria;
        });
  
        if (filteredPhotos.length === 0) {
          alert(`No se encontraron fotos para el número de auditoría: ${numeroAuditoria}`);
          filteredPhotos = data.filter((item: Photo) => item.key.startsWith('photos/'));
        }
      } else {
        filteredPhotos = data.filter((item: Photo) => item.key.startsWith('photos/'));
      }
  
      setPhotos(filteredPhotos);
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
    <div className="photo-doc-summary">
      <p>Número de Auditoría: {numeroAuditoria}</p>
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
}

export default PhotoDocSummary;
