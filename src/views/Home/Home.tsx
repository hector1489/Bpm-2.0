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

  const handleGoToRegister = () => {
    navigate('/register');
  }

  const handleGoToDeafult = () => {
    navigate('/default');
  }



  return (
    <div className="container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>

      <div className="panel-control-container">
        <h2 className="text-center">Panel de Control</h2>
        <div className="card-grid mt-4">
          <button className="card card-none-alimentos" onClick={handleGoToAuditFormView}>
            <div className="card-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="card-title">Auditoría Alimentos</div>
          </button>
          <button className="card card-none" onClick={handleGoToControlDesviaciones}>
            <div className="card-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="card-title">Control de Desviaciones</div>
          </button>
          <button className="card card-none" onClick={handleGoToDocumentacionView}>
            <div className="card-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="card-title">Documentación</div>
          </button>
         
          <button className="card card-none" onClick={handleGoToAnalisis}>
            <div className="card-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="card-title">Análisis</div>
          </button>
          <button className="card card-none" onClick={handleGoToRegister}>
            <div className="card-icon">
              <i className="fa-solid fa-users"></i>
            </div>
            <div className="card-title">Registrar Usuario</div>
          </button>
          <button className="card card-none" onClick={handleGoToEvidenciaFotografica}>
            <div className="card-icon">
              <i className="fas fa-images"></i>
            </div>
            <div className="card-title">Panel de Incidencias Fotograficas</div>
          </button>
          <button className="card card-none" onClick={handleGoToDeafult}>
            <div className="card-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="card-title">Seguridad</div>
          </button>
        </div>


      </div>

      

      <div className="left-icons">
        <div className="icon logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </div>
      </div>

      
    </div>
  )
}

export default Home
