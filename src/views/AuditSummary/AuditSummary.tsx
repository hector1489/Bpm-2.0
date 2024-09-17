import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'
import { AverageModules, Summary } from '../../components'


const AuditSummary: React.FC  = () => {
  const navigate = useNavigate()


  const handleGoToDetails = () => {
    navigate('/resumen-detalle')
  }
  
  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <div className="summary-container">
      <Summary />
      <p>auditoria bpm</p>
      <AverageModules />
      <button onClick={handleGoToDetails}>detalle</button>
      <button onClick={handleGoToHome}>Home</button>
    </div>
  )
}

export default AuditSummary




