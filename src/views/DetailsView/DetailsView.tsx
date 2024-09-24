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

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  };

  const handleGoToETA = () => {
    navigate('/seremi');
  };

  const handleGoToKPI = () => {
    navigate('/kpi');
  };


  return (
    <div className="detail-container">
      <h3>Detalle</h3>
      <div>
        <DetailsTable />
      </div>
      <div>
        <PhotoAudit photos={state.photos} />
      </div>
      <div>
        <AverageTable />
      </div>
      <div className="detail-button">
        <button onClick={handleGoToAuditSummary}>Volver</button>
        <button onClick={handleGoToLuminometry}>Luminometria</button>
        <button onClick={handleGoToETA}>ETA</button>
        <button onClick={handleGoToKPI}>KPI</button>
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  );
};

export default DetailsView;
