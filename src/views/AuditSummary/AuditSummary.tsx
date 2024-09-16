import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'


const AuditSummary = () => {
  const navigate = useNavigate()


  const handleGoToDetails = () => {
    navigate('/resumen-detalle')
  }

  return (
    <>
    <p>resumen</p>
    <p>auditoria bpm</p>
    <p>tabla promedios</p>
    <button onClick={handleGoToDetails}>detalle</button>
    </>
  )
}

export default AuditSummary




