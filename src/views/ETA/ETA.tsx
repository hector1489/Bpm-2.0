import { ETAGraph, ETATable } from '../../components'
import { useNavigate } from 'react-router-dom'
import './ETA.css'

const ETA: React.FC = () => {
  const navigate = useNavigate()
  


  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  const handleGoToDetails = () => {
    navigate('/resumen-detalle');
  }

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  }

  const handleGoToKPI = () => {
    navigate('/kpi');
  }

  return (
    <div className="eta-container">
      <h3>Resumen ETA</h3>
      <ETAGraph  />
      <ETATable />
      <div className="buttons-luminometry">
        <button onClick={handleGoToAuditSummary}>volver</button>
        <button onClick={handleGoToDetails}>detalle</button>
        <button onClick={handleGoToLuminometry}>Luminometria</button>
        <button onClick={handleGoToKPI}>KPI</button>
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}

export default ETA
