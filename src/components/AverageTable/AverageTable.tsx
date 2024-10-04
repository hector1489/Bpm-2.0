import './AverageTable.css'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'


const AverageTable:React.FC = () => {

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
      }, 0);
  
      return totalPercentage / totalQuestions;
    } catch (error) {
      console.error('Error calculating percentage for module:', moduleId, error);
      return 100;
    }
  }
  

  return(
    <div className="average-table">
    <div className="table-responsive">
      <table id="tabla-average" className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>N°</th>
            <th>MODULO</th>
            <th>PORCENTAJE (%)</th>
          </tr>
        </thead>
        <tbody id="average-table-body">
          {state.modules.map((module, index) => (
            <tr key={module.id}>
              <td>{index + 1}</td>
              <td>{module.module}</td>
              <td>{calculatePercentage(module.id).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot className='bg-warning'>
          <tr>
            <td colSpan={2}>PROMEDIO FINAL PONDERADO</td>
            <td>
              {(
                state.modules.reduce((acc, module) => acc + calculatePercentage(module.id), 0) / state.modules.length
              ).toFixed(2)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  )
}


export default AverageTable

