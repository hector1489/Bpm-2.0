import { ResumenForm } from '../../components'
import { useNavigate } from 'react-router-dom'
import './DownloadSummary.css'


const DownloadSummary: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToDoc = () => {
    navigate('/documentacion');
  };


  return (

    <div className="download-summary-container">
    <ResumenForm />
    <button onClick={handleGoToDoc}>volver</button>
    </div>
  )
}


export default DownloadSummary




