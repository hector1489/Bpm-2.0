import { DesviacionesTable } from '../../components'
import { useNavigate } from 'react-router-dom'
import './ControlDesviaciones.css'

const ControlDesviaciones: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="control-desviaciones-container">
      <h3>Control De Desviaciones</h3>
      <DesviacionesTable />
      <div className="buttons-desviaciones">
        <button onClick={handleGoToHome}>volver</button>
      </div>
    </div>
  )
}

export default ControlDesviaciones

