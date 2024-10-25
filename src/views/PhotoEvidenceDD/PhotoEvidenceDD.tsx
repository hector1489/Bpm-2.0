import { PhotoDocSummary } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import './PhotoEvidenceDD.css';

const PhotoEvidenceDD: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const numeroAuditoria = location.state?.numero_requerimiento;

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  const handlePrint = () => {

    requestAnimationFrame(() => {
      window.print();
    });
  };

  return (
    <div className="PhotoEvidenceDD-container">
      <h3>Evidencia Fotográfica</h3>
      <PhotoDocSummary numeroAuditoria={numeroAuditoria} />
      <div className="PhotoEvidenceDD-buttons">
        <button onClick={handleGoDoc}>Volver</button>
        <button onClick={handlePrint}>Descargar</button>
      </div>
    </div>
  );
};

export default PhotoEvidenceDD;
