import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'


const AuditSummary: React.FC  = () => {
  const navigate = useNavigate()


  const handleGoToDetails = () => {
    navigate('/resumen-detalle')
  }

  return (
    <div className="summary-container">
      <p>resumen</p>
      <p>auditoria bpm</p>
      <p>tabla promedios</p>
      <button onClick={handleGoToDetails}>detalle</button>
    </div>
  )
}

export default AuditSummary




