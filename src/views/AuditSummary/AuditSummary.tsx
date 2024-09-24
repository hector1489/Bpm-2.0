import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'
import { AverageModules, BPMGraph, Summary } from '../../components/index'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'

const AuditSummary: React.FC = () => {
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
  }

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }))

  const handleGoToDetails = () => {
    navigate('/resumen-detalle');
  }

  const handleGoToHome = () => {
    navigate('/');
  }

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  }

  const handleGoToETA = () => {
    navigate('/seremi');
  }

  const handleGoToKPI = () => {
    navigate('/kpi');
  }

  return (
    <div className="summary-container">
      <h3>Resumen</h3>
      <Summary />
      <BPMGraph moduleData={moduleData} />
      <AverageModules />
      <div className="buttons-summary">
        <button onClick={handleGoToDetails}>detalle</button>
        <button onClick={handleGoToLuminometry}>Luminometria</button>
        <button onClick={handleGoToETA}>ETA</button>
        <button onClick={handleGoToKPI}>KPI</button>
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default AuditSummary
