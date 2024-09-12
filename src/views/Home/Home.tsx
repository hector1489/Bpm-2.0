import './Home.css'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const handleGoToAuditoria = () => {
    navigate('/auditoria')
  }

  return (
    <div className="container">

      <div className="left-icons">
        <div className="icon">
          <i className="fas fa-tachometer-alt"></i>
        </div>
        <div className="icon">
          <i className="fas fa-cogs"></i>
        </div>
        <div className="icon logout">
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>

      <div className="container">
        
          <h2 className="text-center">Panel de Control</h2>
          <div className="card-grid mt-4">
            <div className="card animated-text">
         
                <button className="card-icon" onClick={handleGoToAuditoria}>
                  <i className="fas fa-utensils"></i>
                </button >
                <div className="card-title">Auditoría Alimentos</div>
        
            </div>
            <div className="card animated-text ">
              <a href="FORMATOBASE.html">
                <div className="card-icon">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <div className="card-title">Control Desviaciones</div>
              </a>
            </div>
            <div className="card animated-text ">
              <a href="construccion.html">
                <div className="card-icon">
                  <i className="fas fa-broom"></i>
                </div>
                <div className="card-title">Auditoría Aseo</div>
              </a>
            </div>
            <div className="card animated-text ">
              <a href="documentacion.html">
                <div className="card-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="card-title">Documentación</div>
              </a>
            </div>
            <div className="card animated-text ">
              <a href="resumeneje.html">
                <div className="card-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="card-title">Análisis</div>
              </a>
            </div>
            <div className="card animated-text ">
              <div className="card-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="card-title">Seguridad</div>
            </div>
            <div className="card animated-text ">
              <a href="capture.html">
                <div className="card-icon">
                  <i className="fas fa-images"></i>
                </div>
                <div className="card-title"> Panel de Incidencias Fotografica</div>
              </a>
            </div>
            <div className="card animated-text ">
              <div className="card-icon">
                <i className="fas fa-wifi"></i>
              </div>
              <div className="card-title">Conectividad</div>
            </div>
          </div>
      </div>
    </div>

  )
}

export default Home


