import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/GlobalState'
import { obtenerPDFs } from '../../utils/apiPdfUtils'
import './DocumentacionView.css'

interface PDFData {
  key: string;
  url: string;
}

const DocumentacionView: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [pdfs, setPdfs] = useState<PDFData[]>([]);
  const [visibleMenuIndex, setVisibleMenuIndex] = useState<number | null>(null);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;
  const numeroAuditoria = state.auditSheetData?.numeroAuditoria;

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await obtenerPDFs();
        setPdfs(response); 
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los PDFs:', error);
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);

  const extractNumeroAuditoria = (key: string): string | null => {
    const matchAuditoria = key.match(/detalle_auditoria_(\d+)_/);
    const matchRequerimiento = key.match(/_auditoria_bpm_(\d+)_/);
    const matchLuminometria = key.match(/_luminometria_(\d+)_/);
    const matchEtaResumen = key.match(/_eta_resumen_(\d+)_/);
  
    if (matchAuditoria) {
      return matchAuditoria[1];
    } else if (matchRequerimiento) {
      return matchRequerimiento[1];
    } else if (matchLuminometria) {
      return matchLuminometria[1];
    } else if (matchEtaResumen) {
      return matchEtaResumen[1];
    }
  
    return null;
  };
  
  const pdfsFiltrados = Array.from(
    new Set(pdfs.map((pdf) => extractNumeroAuditoria(pdf.key)))
  ).map((numeroAuditoria) => {
    return pdfs.find((pdf) => extractNumeroAuditoria(pdf.key) === numeroAuditoria);
  });

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

  const handleToGoPhotos = () => {
    navigate('/evidencia-fotografica');
  };

  return (
    <div className="documentacion-container">
      <h3 className="fw-bold">Documentación</h3>

      <div className="doc-last-audit">
        <h4>Última Auditoria : {numeroAuditoria}</h4>
      </div>

      {loading ? (
        <div>Cargando PDFs...</div>
      ) : (
        <div className="desviaciones">
          {pdfsFiltrados.length > 0 ? (
            <div className="desviaciones-cards">
              {pdfsFiltrados.map((pdf, index) => {
                const numeroAuditoria = extractNumeroAuditoria(pdf?.key || '');
                return (
                  <div className="card" key={index} onClick={() => toggleMenu(index)}>
                    <p>
                      Auditoria <span className="text-warning fw-bold">:</span> {numeroAuditoria}
                    </p>
                    <div className="card-icon">
                      <i className="fa-solid fa-suitcase"></i>
                    </div>

                    {visibleMenuIndex === index && (
                      <div className="dropdown-menu">
                        <button onClick={handleToGoPhotos}>
                          <i className="fa-regular fa-image"></i> Evidencia Fotográfica
                        </button>
                        <button className="btn-doc-editar" onClick={() => goToControlDesviaciones(numeroAuditoria || '')}>
                          <i className="fa-regular fa-pen-to-square"></i> Editar Desviaciones
                        </button>
                        <button onClick={() => handleGoDownloadSummary(numeroAuditoria || '')}>
                          <i className="fa-solid fa-file"></i> Resumen Ejecutivo
                        </button>
                        <button onClick={() => goToRoute1(numeroAuditoria || '')}>
                          <i className="fa-solid fa-file"></i> Informe Ejecutivo
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No se encontraron PDFs para el auditor.</p>
          )}
        </div>
      )}

      <div className="buttons-summary">
        <button onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>
      </div>
    </div>
  )
}

export default DocumentacionView
