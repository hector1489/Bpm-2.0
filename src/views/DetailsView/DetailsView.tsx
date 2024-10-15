import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import logos from '../../assets/img/index';
import './DetailsView.css';
import { AverageTable, PhotoAudit, DetailsTable } from '../../components';

const logoHome = logos.logoHome;
const logoLum = logos.logoLum;
const logoTra = logos.logoTra;

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
    navigate('/home');
  };

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  };

  const handleGoToETA = () => {
    navigate('/seremi');
  };

  const handleNext = () => {
    handleGoToLuminometry();
  };

  return (
    <div className="detail-container">
      <h3 className='fw-bold'>Detalle</h3>
      <p>Auditoria : <span>{state.auditSheetData.numeroAuditoria}</span></p>

      <div className="details-table-container">
        <DetailsTable />
      </div>

      <div className="average-table-container">
        <AverageTable />
      </div>

      <div className="photo-audit-container">
        <PhotoAudit photos={state.photos} />
      </div>

      <div className="detail-button">
        <button onClick={handleNext}>
          Siguiente <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div className="buttons-summary-logo">
        <div className="btn" onClick={handleGoToAuditSummary} title='Volver'>
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="btn">
          <img src={logoLum} alt="lum" onClick={handleGoToLuminometry} title='LUM'/>
        </div>
        <div className="btn">
          <img src={logoTra} alt="tra" onClick={handleGoToETA} title='TRA'/>
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home'/>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
