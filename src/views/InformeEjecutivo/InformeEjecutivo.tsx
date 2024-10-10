import { IEControlCalidad, IECriticalEvaluation, IECriticalFindings, IEEficienciaOp, IEHigiene, IEIndicadoresClave, IESatisfaccion, IESeguridad, IETrazadores } from '../../components';
import './InformeEjecutivo.css'
import { useNavigate, useLocation  } from 'react-router-dom'

const InformeEjecutivo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, numero_requerimiento } = location.state || {};

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="InformeEjecutivo-container">
      <p>Informe Ejecutivo</p>
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}

      <IECriticalFindings />
      <IECriticalEvaluation />
      <IETrazadores />
      <IEIndicadoresClave />
      <IEHigiene />
      <IEEficienciaOp />
      <IESatisfaccion />
      <IESeguridad />
      <IEControlCalidad />

      <button onClick={handleGoDoc}>volver</button>
    </div>
  )
}


export default InformeEjecutivo