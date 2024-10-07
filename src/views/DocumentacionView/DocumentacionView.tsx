import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cargarDatosPorAuditor } from '../../utils/apiUtils';
import './DocumentacionView.css';

const DocumentacionView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [desviaciones, setDesviaciones] = useState<any[]>([]);
  const [visibleMenuIndex, setVisibleMenuIndex] = useState<number | null>(null);

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

  const toggleMenu = (index: number) => {
    setVisibleMenuIndex(visibleMenuIndex === index ? null : index);
  };

  const goToRoute1 = (id: number, numeroRequerimiento: string) => {
    navigate('/informe-ejecutivo', {
      state: { id, numero_requerimiento: numeroRequerimiento },
    });
  };

  const goToControlDesviaciones = (id: number, numeroRequerimiento: string) => {
    navigate('/doc-desviaciones', {
      state: { id, numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleGoDownloadSummary = (id: number, numeroRequerimiento: string) => {
    navigate('/resumen-descarga', {
      state: { id, numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleToGoPhotos = () => {
    navigate('/evidencia-fotografica');
  }

  const desviacionesFiltradas = Array.from(new Set(desviaciones.map(d => d.numero_requerimiento)))
    .map(numero_requerimiento => {
      return desviaciones.find(d => d.numero_requerimiento === numero_requerimiento);
    });

  return (
    <div className="documentacion-container">
      <h3 className='fw-bold'>Documentación</h3>

      <div className="doc-last-audit">
        <h4>Última Auditoria : {numeroAuditoria}</h4>
      </div>

      {loading ? (
        <div>Cargando desviaciones...</div>
      ) : (
        <div className="desviaciones">
          {desviacionesFiltradas.length > 0 ? (
            <div className="desviaciones-cards">
              {desviacionesFiltradas.map((desviacion, index) => (
                <div className="card" key={index} onClick={() => toggleMenu(index)}>
                  <p>Auditoria <span className='text-warning fw-bold'>:</span> {desviacion?.numero_requerimiento}</p>
                  <div className="card-icon">
                    <i className="fa-solid fa-suitcase"></i>
                  </div>

                  {visibleMenuIndex === index && (
                    <div className="dropdown-menu">
                      <button onClick={handleToGoPhotos}>
                      <i className="fa-regular fa-image"></i>
                        Evidencia Fotografica
                      </button>
                      <button onClick={() => goToControlDesviaciones(desviacion?.id, desviacion?.numero_requerimiento)}>
                      <i className="fa-regular fa-pen-to-square"></i>
                        Editar Desviaciones
                      </button>
                      <button onClick={() => handleGoDownloadSummary(desviacion?.id, desviacion?.numero_requerimiento)}>
                        <i className="fa-solid fa-file"></i>
                        Resumen Ejecutivo
                      </button>
                      <button onClick={() => goToRoute1(desviacion?.id, desviacion?.numero_requerimiento)}>
                        <i className="fa-solid fa-file"></i>
                        Informe Ejecutivo
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron desviaciones para el auditor.</p>
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
