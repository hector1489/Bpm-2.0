import AuditForm from "../../components/AuditForm/AuditForm"
import { useNavigate } from 'react-router-dom'
import './auditoria.css'


const Auditoria: React.FC  = () => {
  const navigate = useNavigate()


  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <div className="container-auditoria">
      <AuditForm />
      <div>
      <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}


export default Auditoria