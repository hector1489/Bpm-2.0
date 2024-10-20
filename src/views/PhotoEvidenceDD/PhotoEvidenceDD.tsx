import { PhotosBackend } from '../../components'
import { useLocation, useNavigate  } from 'react-router-dom';
import './PhotoEvidenceDD.css'


const PhotoEvidenceDD: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const numeroAuditoria = location.state?.numero_requerimiento;


  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="PhotoEvidenceDD-container">
       <h3>Evidencia Fotografica</h3>
       <p>Auditoria : {numeroAuditoria}</p>
      <PhotosBackend numeroAuditoria={numeroAuditoria}/>
      <div className="PhotoEvidenceDD-buttons">
      <button onClick={handleGoDoc}>Volver</button>
      </div>
    </div>
  )
}

export default PhotoEvidenceDD

