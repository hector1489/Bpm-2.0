import './Home.css'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import logoFungi from '../../assets/img/logo.jpg'
import { AppContext } from '../../context/GlobalState'

const Home: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { setState } = context;

  const handleLogout = () => {
    setState((prevState) => ({
      ...prevState,
      isAuthenticated: false,
    }));

    navigate('/login');
  };

  const handleGoToAuditFormView = () => {
    navigate('/formulario-auditoria');
  };

  const handleGoToControlDesviaciones = () => {
    navigate('/desviaciones');
  };

  const handleGoToDocumentacionView = () => {
    navigate('/documentacion');
  };

  const handleGoToEvidenciaFotografica = () => {
    navigate('/evidencia-fotografica');
  };

  const handleGoToAnalisis = () => {
    navigate('/analisis');
  };

  const handleGoToDeafult = () => {
    navigate('/default');
  }

  return (
    <div className="container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>

      <div className="left-icons">
        <div className="icon">
          <i className="fa-solid fa-gauge-high"></i>
        </div>
        <div className="icon">
          <i className="fas fa-cogs"></i>
        </div>
        <div className="icon logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>

      <div className="container">
        <h2 className="text-center">Panel de Control</h2>
        <div className="card-grid mt-4">
          <button className="card" onClick={handleGoToAuditFormView}>
            <div className="card-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="card-title">Auditoría Alimentos</div>
          </button>
          <button className="card" onClick={handleGoToControlDesviaciones}>
            <div className="card-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="card-title">Control de Desviaciones</div>
          </button>
          <button className="card" onClick={handleGoToDocumentacionView}>
            <div className="card-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="card-title">Documentación</div>
          </button>
          <button className="card" onClick={handleGoToDeafult}>
              <div className="card-icon">
                <i className="fas fa-broom"></i>
              </div>
              <div className="card-title">Auditoría Aseo</div>
          </button>
         
          <button className="card" onClick={handleGoToAnalisis}>
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="card-title">Análisis</div>
          </button>
          <button className="card" onClick={handleGoToDeafult}>
            <div className="card-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="card-title">Seguridad</div>
          </button>
          <button className="card" onClick={handleGoToEvidenciaFotografica}>
            <div className="card-icon">
              <i className="fas fa-images"></i>
            </div>
            <div className="card-title">Panel de Incidencias Fotograficas</div>
          </button>
          <button className="card" onClick={handleGoToDeafult}>
            <div className="card-icon">
              <i className="fas fa-wifi"></i>
            </div>
            <div className="card-title">Conectividad</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
