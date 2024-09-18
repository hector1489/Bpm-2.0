import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'
import { AverageModules, Summary } from '../../components'


const AuditSummary: React.FC = () => {
  const navigate = useNavigate()


  const handleGoToDetails = () => {
    navigate('/resumen-detalle')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <div className="summary-container">
      <h3>Resumen</h3>
      <Summary />
      <div>
        <p>aqui va auditoria bpm graph</p>
      </div>
      <AverageModules />
      <div className="buttons-summary">
      <button onClick={handleGoToDetails}>detalle</button>
      <button>Luminometria</button>
      <button>ETA</button>
      <button>KPI</button>
      <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default AuditSummary




