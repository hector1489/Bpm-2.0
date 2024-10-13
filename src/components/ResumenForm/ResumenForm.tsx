import './ResumenForm.css'
import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppContext } from '../../context/GlobalState'
import { obtenerPDFs, eliminarPDF } from '../../utils/apiPdfUtils'

interface PDFData {
  key: string;
  url: string;
}

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const [pdfs, setPdfs] = useState<PDFData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const numeroRequerimiento = location.state?.numero_requerimiento || null;

  const fetchPDFs = async () => {
    try {
      const response = await obtenerPDFs();
      setPdfs(response);
      setLoading(false);
      response.forEach((pdf: PDFData) => {
        const numeroAuditoriaExtracted = extractNumeroAuditoria(pdf.key);
        console.log(`Número de auditoría del PDF: ${numeroAuditoriaExtracted}`);
      });
    } catch (error) {
      console.error('Error al obtener los PDFs:', error);
      setLoading(false);
    }
  };

  const handleDeletePDF = async (key: string) => {
    try {
      await eliminarPDF(key);
      setPdfs(pdfs.filter(pdf => pdf.key !== key));
    } catch (error) {
      console.error('Error al eliminar el PDF:', error);
    }
  };

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
  
  const filteredPDFs = pdfs.filter(pdf => {
    const numeroAuditoria = extractNumeroAuditoria(pdf.key);
    return numeroAuditoria === numeroRequerimiento;
  });

  const indexOfLastPDF = currentPage * itemsPerPage;
  const indexOfFirstPDF = indexOfLastPDF - itemsPerPage;
  const currentPDFs = filteredPDFs.slice(indexOfFirstPDF, indexOfLastPDF);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredPDFs.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  return (
    <div className="Resumen-form-container">
      {loading ? (
        <p>Cargando PDFs...</p>
      ) : (
        <>
          <div className="pdf-card-container">
            {currentPDFs.length > 0 ? (
              currentPDFs.map((pdf) => (
                <div key={pdf.key} className="pdf-card">
                  <p>PDF: {pdf.key}</p>
                  <div className="pdf-dd-car-buttons">
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                      Ver PDF
                    </a>
                    <button className='btn-red' onClick={() => handleDeletePDF(pdf.key)}>Eliminar PDF</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron PDFs para el número de auditoría {numeroRequerimiento}.</p>
            )}
          </div>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage} de {Math.ceil(filteredPDFs.length / itemsPerPage)}</span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredPDFs.length / itemsPerPage)}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ResumenForm
