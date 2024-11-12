import { ETAGraph, ETAHeaderSummary, ETATable } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import './ETA.css';
import logos from '../../assets/img/index';

const logoDetails = logos.logoDetails;
const logoHome = logos.logoHome;
const logoLum = logos.logoLum;


const ETA: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const calculatePercentage = (moduleId: number): number => {
    try {
      const moduleQuestions = state.IsHero.filter(question => question.id === moduleId);
      const totalQuestions = moduleQuestions.length;

      if (totalQuestions === 0) {
        return 100;
      }

      const totalPercentage = moduleQuestions.reduce((acc, question) => {
        if (question.answer && typeof question.answer === 'string') {
          const match = question.answer.match(/(\d+)%/);
          const percentage = match ? parseInt(match[1], 10) : 0;
          return acc + percentage;
        } else {
          return acc;
        }
      }, 0);

      return totalPercentage / totalQuestions;
    } catch (error) {
      console.error('Error calculating percentage for module:', moduleId, error);
      return 100;
    }
  };

  const handleGoToAuditSummary = () => {
    navigate('/resumen-replace');
  };

  const handleGoToHome = () => {
    navigate('/home');
  };

  const handleGoToDetails = () => {
    navigate('/resumen-detalle');
  };

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  };

  return (
    <div className="eta-container">
      <h3>Resumen ETA</h3>
      <ETAHeaderSummary moduleData={state.modules.map(module => ({
        moduleName: module.module,
        percentage: calculatePercentage(module.id),
      }))} />
      <ETAGraph moduleData={state.modules.map(module => ({
        moduleName: module.module,
        percentage: calculatePercentage(module.id),
      }))} />
      <ETATable />

      <div className="detail-button">
        <button onClick={handleGoToHome}>
          Siguiente <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div className="buttons-summary-logo">
        <div className="btn" onClick={handleGoToAuditSummary} title='Volver'>
          <i className="fa-solid fa-arrow-left" ></i>
        </div>
        <div className="btn">
          <img src={logoDetails} alt="details" onClick={handleGoToDetails} title='Details' />
        </div>
        <div className="btn">
          <img src={logoLum} alt="lum" onClick={handleGoToLuminometry} title='LUM' />
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home' />
        </div>
      </div>
    </div>
  );
};

export default ETA;
