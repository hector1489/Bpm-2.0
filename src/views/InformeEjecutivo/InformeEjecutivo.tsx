import './InformeEjecutivo.css'
import { useNavigate } from 'react-router-dom'

const InformeEjecutivo: React.FC = () => {
  const navigate = useNavigate();

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  return (
    <div className="InformeEjecutivo-container">
      <p>Informe Ejecutivo</p>
      <button onClick={handleGoDoc}>volver</button>
    </div>
  )
}


export default InformeEjecutivo