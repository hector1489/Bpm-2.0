import { PhotoAudit, PhotosBackend } from '../../components'
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import './PhotoEvidence.css'


const PhotoEvidence: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('DetailsView debe ser utilizado dentro de un AppProvider');
  }

  const { state } = context;

  const numeroAuditoriaPorDefecto = "0";

  const handleGoToHome = () => {
    navigate('/home');
  };

  return (
    <div className="panel-foto-container">
      <h3>Panel de Evidencia Fotografica</h3>
      <PhotoAudit photos={state.photos} />
      <PhotosBackend numeroAuditoria={numeroAuditoriaPorDefecto}/>
      <div className="buttons-summary">
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default PhotoEvidence