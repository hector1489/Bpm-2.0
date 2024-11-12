import { ETADetailsSymary } from '../../components'
import './ETADetailsDD.css'
import { useLocation, useNavigate  } from 'react-router-dom';


const ETADetailsDD: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const numeroAuditoria = location.state?.numero_requerimiento;


  const handleGoToDoc = () => {
    navigate('/documentacion');
  }


  return (
    <div className="ETADetailsDD-container">
      <ETADetailsSymary numeroAuditoria={numeroAuditoria}/>
      <button  onClick={handleGoToDoc}>Volver</button>
    </div>
  )
}

export default ETADetailsDD

