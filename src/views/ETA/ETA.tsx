import { ETAGraph, ETATable } from '../../components'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import './ETA.css'

const ETA: React.FC = () => {
  const navigate = useNavigate()
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
  }

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }))


  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  const handleGoToDetails = () => {
    navigate('/resumen-detalle');
  }

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  }

  return (
    <div className="eta-container">
      <h3>Resumen ETA</h3>
      <ETAGraph moduleData={moduleData} />
      <ETATable />
      <div className="detail-button">
        <button className='btn-circle btn-green' onClick={handleGoToAuditSummary}>
        <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToDetails} title='Detalle'>
          <i className="fa-solid fa-circle-info"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToLuminometry} title='Luminometria'>
          <i className="fa-regular fa-lightbulb"></i>
        </button>
        <button className='btn-circle' onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}

export default ETA
