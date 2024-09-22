import { BPMGraph, DetailsTable, ETAGraph, ETATable, LUMGraph } from '../../components'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import './DocumentacionView.css'

const DocumentacionView: React.FC = () => {
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

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }));

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="documentacion-container">
      <h3>Documentación</h3>
      <div className="documentacion-graficos">
        <div className="documentacion-grafico">
          <BPMGraph moduleData={moduleData} />
        </div>
        <div className="documentacion-grafico">
          <LUMGraph moduleData={moduleData} />
        </div>
        <div className="documentacion-grafico">
          <ETAGraph moduleData={moduleData} />
        </div>
      </div>
      <div className="documentacion-tablas">
        <div className="documentacion-table">
          <ETATable />
        </div>
        <div className="documentacion-table">
          <DetailsTable />
        </div>
      </div>
      <div className="buttons-summary">
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default DocumentacionView
