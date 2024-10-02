import { DesviacionesTable, IncidentSummary } from '../../components'
import { useNavigate } from 'react-router-dom'
import './ControlDesviaciones.css'


const ControlDesviaciones: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToHome = () => {
    navigate('/');
  };


  return (
    <div className="control-desviaciones-container">
      <h3 className='m-4'>Control De Desviaciones</h3>
      <div>
        <IncidentSummary />
      </div>
      <div className='control-desviaciones-table'>
        <DesviacionesTable />
      </div>
      <div className="buttons-desviaciones">
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}

export default ControlDesviaciones


