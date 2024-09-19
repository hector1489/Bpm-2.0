import DetailsTable from '../../components/DetailsTable/DetailsTable'
import { useNavigate } from 'react-router-dom'
import './DetailsView.css'
import { AverageTable } from '../../components'

const DetailsView: React.FC = () => {
  const navigate = useNavigate()

  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria')
  }

  return (
    <div className="detail-container">
      <div>
        <DetailsTable />
      </div>
      <div>
        <AverageTable />
      </div>
      <div className="detail-button">
        <button onClick={handleGoToAuditSummary}>volver</button>

      </div>
    </div>
  )
}

export default DetailsView




