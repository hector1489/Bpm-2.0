import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'
import { AverageModules, BPMGraph, Summary } from '../../components'


const AuditSummary: React.FC = () => {
  const navigate = useNavigate()

  const moduleData = [
    { moduleName: 'Módulo 1', percentage: 85 },
    { moduleName: 'Módulo 2', percentage: 75 },
    { moduleName: 'Módulo 3', percentage: 90 },
    { moduleName: 'Módulo 4', percentage: 65 },
  ];

  const handleGoToDetails = () => {
    navigate('/resumen-detalle')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  const handleGoToLuminometry = () => {
    navigate('/luminometria')
  }

  const handleGoToETA = () => {
    navigate('/seremi')
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
      <button>KPI</button>
      <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default AuditSummary




