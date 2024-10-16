import { DetailsAverageSummary, TableDetailsSummary } from '../../components'
import './TableDetailsDD.css'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const TableDetailsDD: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const numeroAuditoria = location.state?.numero_requerimiento;

  const handleGoToDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="TableDetailsDD-container">
      <p>Vista para descarga</p>
      <TableDetailsSummary numeroAuditoria={numeroAuditoria} />
      <DetailsAverageSummary numeroAuditoria={numeroAuditoria}/>
      <button onClick={handleGoToDoc}>Volver</button>
    </div>
  )
}

export default TableDetailsDD;
