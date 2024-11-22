import './Analysis.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import { Chatbot, IncidentSummary, LastAudit } from '../../components'
import logoFungi from '../../assets/img/logo.jpg'

const Analysis: React.FC = () => {
  const navigate = useNavigate()
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const handleGoToHome = () => {
    navigate('/home')
  }

 

  return (
    <div className="analysis-container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3>total incidencias</h3>
      <IncidentSummary/>
      <LastAudit />

      <Chatbot />

      <div className="buttons-analysis">
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default Analysis
