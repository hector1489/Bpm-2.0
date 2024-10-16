import { LUMDetailsSummary } from '../../components'
import { useNavigate, useLocation } from 'react-router-dom';
import './LUMDetailsDD.css'




const LUMDetailsDD: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const numeroAuditoria = location.state?.numero_requerimiento;

  const handleGoToDoc = () => {
    navigate('/documentacion');
  }

  return (
    <div className="LUMDetailsDD-container">
      <LUMDetailsSummary numeroAuditoria={numeroAuditoria} />
      <div className='btn-lum-detailsDD'>
      <button  onClick={handleGoToDoc}>Volver</button>
      </div>
    </div>
  )
}


export default LUMDetailsDD

