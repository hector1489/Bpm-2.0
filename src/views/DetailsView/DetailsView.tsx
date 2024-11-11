import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useNavigate } from 'react-router-dom';
import logos from '../../assets/img/index';
import './DetailsView.css';
import { AverageTable, DetailsTable } from '../../components';
import { createTablaDetail } from '../../utils/apiDetails';
import { createAuditSheet } from '../../utils/apiAuditSheet';

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


  const handleSendToBackend = async () => {
    const dataToSend = state.IsHero.map((question) => {
      const numeroAuditoria = state.auditSheetData.numeroAuditoria;
      const currentModule = state.modules.find(module => {
        if (!module.question) {
          return false;
        }
        const moduleQuestions = Array.isArray(module.question) ? module.question : [module.question];
        const questionText = Array.isArray(question.question) ? question.question.join(' ') : question.question;
        return moduleQuestions.some(q => questionText.includes(q));
      });

      if (!currentModule) {
        console.error('No se encontró el módulo correspondiente para la pregunta:', question);
        return null;
      }

      return {
        numero_auditoria: numeroAuditoria,
        columna1: question.id,
        columna2: currentModule.module || 'Unknown Module',
        columna3: question.question,
        columna4: question.answer || 'No answer yet'
      };
    }).filter(Boolean);


    try {
      await createTablaDetail(dataToSend);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const handleSendAuditSheetToBackend = async () => {
    try {
      // Verifica que los datos de auditoría existan en el estado
      if (!state.auditSheetData || !state.userName) {
        console.error('No se encontraron los datos de auditoría o el username.');
        return;
      }

      // Construir el objeto de datos para enviar al backend
      const dataToSendAuditSheet = {
        username: state.userName,
        numero_auditoria: state.auditSheetData.numeroAuditoria,
        field1: state.auditSheetData.nombreEstablecimiento,
        field2: state.auditSheetData.gerenteEstablecimiento,
        field3: state.auditSheetData.administradorEstablecimiento,
        field4: state.auditSheetData.supervisorEstablecimiento,
        field5: state.auditSheetData.auditorEmail,
        field6: state.auditSheetData.fechaAuditoria,
      };


      await createAuditSheet(dataToSendAuditSheet);
    } catch (error) {
      console.error('Error al enviar los datos de la auditoría al backend:', error);
    }
  };

  const handleGoToAuditSummary = () => {
    navigate('/resumen-replace');
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
    handleSendToBackend();
    handleSendAuditSheetToBackend();
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
