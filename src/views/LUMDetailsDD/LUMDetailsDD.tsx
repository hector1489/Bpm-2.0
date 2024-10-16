import { LUMDetailsSummary } from '../../components'
import { useNavigate } from 'react-router-dom';
import './LUMDetailsDD.css'


const LUMDetailsDD: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDoc = () => {
    navigate('/documentacion');
  }

  return (
    <div className="LUMDetailsDD-container">
      <LUMDetailsSummary />
      <button onClick={handleGoToDoc}>Volver</button>
    </div>
  )
}


export default LUMDetailsDD

