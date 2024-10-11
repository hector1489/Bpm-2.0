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
      <h3>Informe Ejecutivo</h3>
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}

      <h5>1.- HALLAZGOS CRITICOS/ACCIONES CORRECTIVAS</h5>
      <IECriticalFindings />

      <h5>2.- EVALUACIONES CRITICAS</h5>
      <IECriticalEvaluation />

      <h5>3. TRAZADORES</h5>
      <IETrazadores />

      <h5>4.- INDICADORES CLAVES DE GESTION</h5>
      <IEIndicadoresClave />
      
      <h5>5,. HIGIENE INSTALACIONES/ALIMENTOS</h5>
      <IEHigiene />
      
      <h5>6. EFICIENCIA OPERACIONAL</h5>
      <IEEficienciaOp />

      <h5>7.- SATISFACCION AL CLIENTE</h5>
      <IESatisfaccion />

      <h5>8.  SEGURIDAD ALIMENTARIA</h5>
      <IESeguridad />

      <h5>9.- CONTROL DE CALIDAD</h5>
      <IEControlCalidad />

      <button onClick={handleGoDoc}>volver</button>
    </div>
  )
}


export default InformeEjecutivo