import './Average.css'
import { useContext, useMemo } from 'react'
import { AppContext } from '../../context/GlobalState'

const AverageModules: React.FC = () => {
  const { state } = useContext(AppContext) || {};

  if (!state) {
    return <div>Error: Context is not available.</div>;
  }

  const calculatePercentage = (moduleId: number): number => {
    const moduleQuestions = state.IsHero.filter(question => question.id === moduleId);
    const totalQuestions = moduleQuestions.length;

    if (totalQuestions === 0) return 100;

    const totalPercentage = moduleQuestions.reduce((acc, question) => {
      const match = typeof question.answer === 'string' ? question.answer.match(/(\d+)%/) : null;
      const percentage = match ? parseInt(match[1], 10) : 0;
      return acc + percentage;
    }, 0);

    return totalPercentage / totalQuestions;
  }

  const finalAverage = useMemo(() => {
    const totalPercentage = state.modules.reduce((acc, module) => acc + calculatePercentage(module.id), 0);
    return (totalPercentage / state.modules.length).toFixed(2);
  }, [state.modules])

  return (
    <div className="audit-summary">
      <div className="table-responsive">
        <table id="tabla-auditoria" className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>N°</th>
              <th>MODULO</th>
              <th>PORCENTAJE (%)</th>
            </tr>
          </thead>
          <tbody id="audit-table-body">
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
              <td>{finalAverage}%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default AverageModules
