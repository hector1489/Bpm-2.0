import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cargarDatosPorAuditor } from '../../utils/apiUtils';
import './DocumentacionView.css';

const DocumentacionView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [desviaciones, setDesviaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;
  const numeroAuditoria = state.auditSheetData.numeroAuditoria;
  const auditor = state.userName || '';
  const authToken = state.authToken || '';

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await cargarDatosPorAuditor(auditor, authToken);
        setDesviaciones(datos);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos del auditor:', error);
        setLoading(false);
      }
    };

    cargarDatos();
  }, [auditor, authToken]);

  const handleGoToHome = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const goToRoute1 = () => {
    navigate('/informe-ejecutivo');
  };

  const goToRoute2 = () => {
    navigate('/resumen-ejecutivo');
  };

  const goToControlDesviaciones = () => {
    navigate('/desviaciones');
  };

  return (
    <div className="documentacion-container">
      <h3>Documentación</h3>

      <div className="doc-last-audit">
        <h4>Última Auditoria : {numeroAuditoria}</h4>
        <button className="card" onClick={toggleMenu}>
          <div className="card-icon">
            <i className="fa-solid fa-suitcase"></i>
          </div>
        </button>

        {menuVisible && (
          <div className="dropdown-menu">
            <button onClick={goToControlDesviaciones}>
              <i className="fa-solid fa-file"></i>
              Editar Desviaciones
            </button>
            <button onClick={goToRoute2}>
              <i className="fa-solid fa-file"></i>
              Resumen Ejecutivo
            </button>
            <button onClick={goToRoute1}>
              <i className="fa-solid fa-file"></i>
              Informe Ejecutivo
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div>Cargando desviaciones...</div>
      ) : (
        <div className="desviaciones">
          <h4>Desviaciones del Auditor : </h4>
          {desviaciones.length > 0 ? (
            <div className="desviaciones-cards">
              {desviaciones.map((desviacion, index) => (
                <div className="card" key={index} onClick={toggleMenu}>
                  <h5>Requerimiento {desviacion.numero_requerimiento}</h5>
                  <div className="card-icon">
                    <i className="fa-solid fa-suitcase"></i>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron desviaciones para el auditor.</p>
          )}
        </div>
      )}

      <div className="buttons-summary">
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  );
};

export default DocumentacionView;
