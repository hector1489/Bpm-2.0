import './Analysis.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import { KPIGraph } from '../../components'

const Analysis: React.FC = () => {
  const navigate = useNavigate()
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context


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
      }, 0)

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

  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <div className="analysis-container">
      <h3>Analisis</h3>
      <KPIGraph moduleData={moduleData} />
      <div className="buttons-luminometry">
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default Analysis