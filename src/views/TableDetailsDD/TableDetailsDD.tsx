import { TableDetailsSummary } from '../../components'
import './TableDetailsDD.css'
import { useLocation } from 'react-router-dom';

const TableDetailsDD: React.FC = () => {
  const location = useLocation();
  const numeroAuditoria = location.state?.numero_requerimiento;

  return (
    <div className="TableDetailsDD-container">
      <p>Vista para descarga</p>
      <TableDetailsSummary numeroAuditoria={numeroAuditoria} />
    </div>
  )
}

export default TableDetailsDD;
