import './ResumenForm.css';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { obtenerPDFs, eliminarPDF } from '../../utils/apiPdfUtils';

interface PDFData {
  key: string;
  url: string;
}

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<PDFData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const numeroRequerimiento = location.state?.numero_requerimiento || null;

  const fetchPDF = async () => {
    try {
      const response = await obtenerPDFs();
      const pdfDetalleAuditoria = response.find((pdf: PDFData) => {
        const matchAuditoria = pdf.key.match(/detalle_auditoria_(\d+)_/);
        return !!matchAuditoria;
      });

      setPdf(pdfDetalleAuditoria || null);
      setLoading(false);

      if (pdfDetalleAuditoria) {
        const numeroAuditoriaExtracted = extractNumeroAuditoria(pdfDetalleAuditoria.key);
        console.log(`Número de auditoría del PDF: ${numeroAuditoriaExtracted}`);
      }
    } catch (error) {
      console.error('Error al obtener los PDFs:', error);
      setLoading(false);
    }
  };

  const handleDeletePDF = async (key: string) => {
    try {
      await eliminarPDF(key);
      setPdf(null);
    } catch (error) {
      console.error('Error al eliminar el PDF:', error);
    }
  };

  const extractNumeroAuditoria = (key: string): string | null => {
    const matchAuditoria = key.match(/detalle_auditoria_(\d+)_/);
    return matchAuditoria ? matchAuditoria[1] : null;
  };

  const getPdfTitleWithNumber = (key: string): string => {
    const matchAuditoria = key.match(/detalle_auditoria_(\d+)_/);
    return matchAuditoria ? `Detalle Auditoría ${matchAuditoria[1]}` : 'Desconocido';
  };

  useEffect(() => {
    fetchPDF();
  }, []);

  const handleGoToDDeatils = () => {
    navigate('/download-details', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleGoToDBPM = () => {
    navigate('/download-bpm', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleGoToDETA = () => {
    navigate('/download-eta', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  const handleGoToDLUM = () => {
    navigate('/download-lum', {
      state: { numero_requerimiento: numeroRequerimiento },
    });
  };

  return (
    <div className="Resumen-form-container">
      {loading ? (
        <p>Cargando PDF...</p>
      ) : pdf ? (
        <>
          <div className="pdf-card-container">
            <div className="pdf-card">
              <i className="fa-regular fa-file-pdf"></i>
              <p>{getPdfTitleWithNumber(pdf.key)}</p>
              <div className="pdf-dd-car-buttons">
                <button>
                  <a className='btn-pdf-resumenForm' href={pdf.url} target="_blank" rel="noopener noreferrer">
                    Ver Auditoria
                  </a>
                </button>
                <button className='btn-red' onClick={() => handleDeletePDF(pdf.key)}>Eliminar PDF</button>
              </div>

            </div>



            <div className="routes-downloads">
              <button onClick={handleGoToDDeatils}>Ir a Details</button>
            </div>
            <div className="routes-downloads">
              <button onClick={handleGoToDBPM}>Ir a BPM</button>
            </div>
            <div className="routes-downloads">
              <button onClick={handleGoToDETA}>Ir a ETA</button>
            </div>
            <div className="routes-downloads">
              <button onClick={handleGoToDLUM}>Ir a LUM</button>
            </div>

          </div>

        </>
      ) : (
        <p>No se encontró el PDF de la auditoría.</p>
      )}
    </div>
  );
};

export default ResumenForm;
