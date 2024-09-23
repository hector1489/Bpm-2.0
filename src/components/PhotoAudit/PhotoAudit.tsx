import './PhotoAudit.css'

interface PhotoGalleryProps {
  photos: { question: string; photoUrl: string }[];
}

const PhotoAudit: React.FC<PhotoGalleryProps> = ({ photos }) => {



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
          </div>
        ))
      )}
    </div>
    </div>
  );
}

export default PhotoAudit

