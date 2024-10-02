import './DocDesviacionesTable.css'
import { DesviacionesTable } from '../../components'
import { useNavigate } from 'react-router-dom'

const DocDesviacionesTable: React.FC = () => {
  const navigate = useNavigate()

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="control-desviaciones-container">
    <p>DocDesviacionesTable</p>
    <DesviacionesTable />
    <div className="buttons-desviaciones">
        <button onClick={handleGoDoc}>
        <i className="fa-solid fa-arrow-left"></i>
        </button>
      </div>
      </div>
  )
}

export default DocDesviacionesTable



