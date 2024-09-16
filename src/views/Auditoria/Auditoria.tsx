import AuditForm from "../../components/AuditForm/AuditForm"
import { useNavigate } from 'react-router-dom'
import './auditoria.css'


const Auditoria = () => {
  const navigate = useNavigate()


  const handleGoToHome = () => {
    navigate('/')
  }

  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria')
  }

  return (
    <div className="container-auditoria">
      <AuditForm />
      <div>
      <button onClick={handleGoToHome}>volver</button>
      <button onClick={handleGoToAuditSummary}>Resumen</button>
      </div>
    </div>
  )
}


export default Auditoria