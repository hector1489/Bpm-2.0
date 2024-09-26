import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import './DocumentacionView.css';

const DocumentacionView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [menuVisible, setMenuVisible] = useState(false);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const numeroAuditoria = state.auditSheetData.numeroAuditoria

  const handleGoToHome = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const goToRoute1 = () => {
    navigate('/resumen-auditoria');
  };

  const goToRoute2 = () => {
    navigate('/analisis');
  };


  return (
    <div className="documentacion-container">
      <h3>Documentación</h3>

      <div className="doc-last-audit">
        <h4>Ultima Auditoria : {numeroAuditoria}</h4>
        <button className="card" onClick={toggleMenu}>
          <div className="card-icon">
            <i className="fa-solid fa-suitcase"></i>
          </div>
        </button>

        {menuVisible && (
          <div className="dropdown-menu">
            <button onClick={goToRoute1}>
              <i className="fa-solid fa-file"></i>
              Resumen Ejecutivo
            </button>
            <button onClick={goToRoute2}>
            <i className="fa-solid fa-file"></i>
              Informe Ejecutivo
            </button>
          </div>
        )}
      </div>

      <div className="buttons-summary">
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  );
};

export default DocumentacionView;
