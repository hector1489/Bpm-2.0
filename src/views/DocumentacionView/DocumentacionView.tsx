import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getAllTablaDetailsNumbersAudit } from '../../utils/apiDetails';
import logo from '../../assets/img/logo.jpg';
import './DocumentacionView.css';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

const DocumentacionView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [visibleMenuIndex, setVisibleMenuIndex] = useState<number | null>(null);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  useEffect(() => {
    const fetchTablaDetails = async () => {
      try {
        const response = await getAllTablaDetailsNumbersAudit();
        
        if (Array.isArray(response)) {
          setTablaDetails(response);
        } else {
          setTablaDetails([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los detalles:', error);
        setLoading(false);
      }
    };

    fetchTablaDetails();
  }, []);

  const handleGoToHome = () => {
    navigate('/home');
  };

  const toggleMenu = (index: number) => {
    setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
  };

  const goToRoute1 = (numeroRequerimiento: string) => {
    navigate('/informe-ejecutivo', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  const goToControlDesviaciones = (numeroRequerimiento: string) => {
    navigate('/doc-desviaciones', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleGoDownloadSummary = (numeroRequerimiento: string) => {
    navigate('/resumen-descarga', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleToGoPhotos = (numeroRequerimiento: string) => {
    navigate('/photos-auditoria', {
      state: { numero_requerimiento: numeroRequerimiento}
    });
  };

  const uniqueAuditorias = Array.from(new Set(tablaDetails.map((detail) => detail.numero_auditoria)));

  return (
    <div className="documentacion-container">
      <div className="logo-fungi">
        <img src={logo} alt="logo" />
      </div>
      <h3 className="fw-bold">Documentación</h3>

      {loading ? (
        <div>Cargando la Base de Datos...</div>
      ) : (
        <div className="desviaciones">
          {uniqueAuditorias.length > 0 ? (
            <div className="desviaciones-cards">
              {uniqueAuditorias.map((numeroAuditoria, index) => (
                <div className="card" key={index} onClick={() => toggleMenu(index)}>
                  <p>
                    Auditoria <span className="text-warning fw-bold">:</span> {numeroAuditoria}
                  </p>
                  <div className="card-icon">
                    <i className="fa-solid fa-suitcase"></i>
                  </div>

                  {visibleMenuIndex === index && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleToGoPhotos(numeroAuditoria)}>
                        <i className="fa-regular fa-image"></i> Evidencia Fotográfica
                      </button>
                      <button className="btn-doc-editar" onClick={() => goToControlDesviaciones(numeroAuditoria)}>
                        <i className="fa-regular fa-pen-to-square"></i> Editar Desviaciones
                      </button>
                      <button onClick={() => handleGoDownloadSummary(numeroAuditoria)}>
                        <i className="fa-solid fa-file"></i> Resumen Ejecutivo
                      </button>
                      <button onClick={() => goToRoute1(numeroAuditoria)}>
                        <i className="fa-solid fa-file"></i> Informe Ejecutivo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron Auditorias para el auditor.</p>
          )}
        </div>
      )}

      <div className="buttons-summary">
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  );
};

export default DocumentacionView;
