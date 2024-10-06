import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import './DetailsView.css';
import { AverageTable, PhotoAudit, DetailsTable } from '../../components';

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

  return (
    <div className="detail-container">
      <h3 className='fw-bold'>Detalle</h3>
      <div>
        <DetailsTable />
      </div>
      <div>
        <AverageTable />
      </div>
      <div>
        <PhotoAudit photos={state.photos} />
      </div>
      <div className="detail-button">
        <button className='btn-circle btn-green' onClick={handleGoToAuditSummary}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToLuminometry} title='Luminometria'>
          <i className="fa-regular fa-lightbulb"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToETA} title='ETA'>
          <i className="fa-solid fa-e"></i>
        </button>
        <button className='btn-circle' onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  );
};

export default DetailsView;
