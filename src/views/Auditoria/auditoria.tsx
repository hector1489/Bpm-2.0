import AuditForm from "../../components/AuditForm/AuditForm"
import { useNavigate } from 'react-router-dom'
import './auditoria.css'


const Auditoria = () => {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <div className="container-auditoria">
      <AuditForm />
      <button onClick={handleGoToHome}>volver</button>
    </div>
  )
}


export default Auditoria