import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import './PhotoAudit.css';

interface PhotoGalleryProps {
  photos: { question: string; photoUrl: string }[];
}

const PhotoAudit: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const context = useContext(AppContext);

  if (!context) {
    return null;
  }

  const { removePhoto } = context;

  const handleRemovePhoto = (photoUrl: string) => {
    removePhoto(photoUrl);
  };

  return (
    <div className="photo-audit-container">
      <h4>Capturas</h4>
      <div className="photo-gallery">
        {photos.length === 0 ? (
          <p>No hay fotos capturadas.</p>
        ) : (
          photos.map((photo, index) => (
            <div key={index} className="photo-item">
              <p>{photo.question}</p>
              <img src={photo.photoUrl} alt={`Captura ${index + 1}`} />
              <button 
                className="delete-photo-button"
                onClick={() => handleRemovePhoto(photo.photoUrl)}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotoAudit;
