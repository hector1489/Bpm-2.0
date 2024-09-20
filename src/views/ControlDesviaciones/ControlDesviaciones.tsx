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
      <p>ControlDesviaciones</p>
      <DesviacionesTable />
      <div className="buttons-desviaciones">
        <button onClick={handleGoToHome}>volver</button>
      </div>
    </div>
  )
}

export default ControlDesviaciones


