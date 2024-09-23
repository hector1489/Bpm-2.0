import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import './DetailsView.css';
import { AverageTable, PhotoAudit,DetailsTable  } from '../../components';

const DetailsView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('DetailsView debe ser utilizado dentro de un AppProvider');
  }

  const { state } = context;

  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria');
  };

  return (
    <div className="detail-container">
      <h3>Detalle</h3>
      <div>
        <DetailsTable />
      </div>
      <div>
        <h4>Fotos Capturadas</h4>
        <PhotoAudit photos={state.photos} />
      </div>
      <div>
        <AverageTable />
      </div>
      <div className="detail-button">
        <button onClick={handleGoToAuditSummary}>Volver</button>
      </div>
    </div>
  );
};

export default DetailsView;
