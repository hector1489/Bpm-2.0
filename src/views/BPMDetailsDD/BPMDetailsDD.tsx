import { BPMDetailsSummary } from '../../components'
import './BPMDetailsDD.css'
import { useLocation, useNavigate  } from 'react-router-dom';

const BPMDetailsDD: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const numeroAuditoria = location.state?.numero_requerimiento;


  const handleGoToDoc = () => {
    navigate('/documentacion');
  }

  return (
    <div className="BPMDetailsDD-container">
    <BPMDetailsSummary numeroAuditoria={numeroAuditoria}/>
    <button onClick={handleGoToDoc}>volver</button>
    </div>
  )
}


export default BPMDetailsDD