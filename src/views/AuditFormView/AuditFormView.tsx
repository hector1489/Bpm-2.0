import AuditSheet from '../../components/AuditSheet/AuditSheet'
import { useNavigate } from 'react-router-dom'
import './AuditFormView.css'

const AuditFormView: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/')
  }

  return (
    <div className="auditoria-formulario-container">
      <AuditSheet />
      <div className="buttons-summary">
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}


export default AuditFormView
