import './DocDesviacionesTable.css'
import { DesviacionesTable } from '../../components'
import { useNavigate } from 'react-router-dom'

const DocDesviacionesTable: React.FC = () => {
  const navigate = useNavigate()

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  const handleGoToHome = () => {
    navigate('/home');
  };

  return (
    <div className="control-desviaciones-container">
      <DesviacionesTable />
      <div className="buttons-desviaciones">
        <button onClick={handleGoDoc}> 
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}

export default DocDesviacionesTable



