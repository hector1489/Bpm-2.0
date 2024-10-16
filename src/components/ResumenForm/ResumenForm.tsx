import './ResumenForm.css';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { obtenerPDFs, eliminarPDF } from '../../utils/apiPdfUtils';
import { deleteTablaDetail, getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';

interface PDFData {
  key: string;
  url: string;
}

interface TablaDetail {
  id: number;
  numero_requerimiento: string;
  // Add other properties as needed
}

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<PDFData | null>(null);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail | null>(null);
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
      } else {
        await fetchTablaDetails();
      }
    } catch (error) {
      console.error('Error al obtener los PDFs:', error);
      setLoading(false);
    }
  };

  const fetchTablaDetails = async () => {
    if (numeroRequerimiento) {
      try {
        const response: any[] = await getTablaDetailsByNumeroAuditoria(numeroRequerimiento);
        
        setTablaDetails(response.length > 0 ? response[0] : null);
        console.log('Detalles de la tabla encontrados:', response[0]);
      } catch (error) {
        console.error('Error al obtener los detalles de la tabla:', error);
      }
    }
  };
  

  const handleDeletePDF = async (key: string) => {
    try {
      await eliminarPDF(key);

      if (numeroRequerimiento) {
        await deleteTablaDetail(numeroRequerimiento);
        console.log(`Detalles de la auditoría ${numeroRequerimiento} eliminados correctamente.`);
      } else {
        console.warn('No se pudo eliminar los detalles de la tabla: número de auditoría no disponible.');
      }

      setPdf(null);
    } catch (error) {
      console.error('Error al eliminar el PDF o los detalles de la tabla:', error);
    }
  };

  const extractNumeroAuditoria = (key: string): string | null => {
    const matchAuditoria = key.match(/detalle_auditoria_(\d+)_/);
    return matchAuditoria ? matchAuditoria[1] : null;
  };

  useEffect(() => {
    fetchPDF();
  }, []);

  const handleGoToDDetails = () => {
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

  const handleDeleteTable = async () => {
    try {
      if (numeroRequerimiento) {
        await deleteTablaDetail(numeroRequerimiento);
        console.log(`Detalles de la auditoría ${numeroRequerimiento} eliminados correctamente.`);
      } else {
        console.warn('No se pudo eliminar los detalles de la tabla: número de auditoría no disponible.');
      }
    } catch (error) {
      console.error('Error al eliminar los detalles de la tabla:', error);
    }
  };
  

  return (
    <div className="Resumen-form-container">
      {loading ? (
        <p>Cargando PDF...</p>
      ) : pdf ? (
        <div className="pdf-card-container">
          <i className="fa-regular fa-file-pdf"></i>
          <p>Auditoria {numeroRequerimiento}</p>

          <div className="routes-downloads">
            <button onClick={handleGoToDDetails}>Ver Details</button>
            <button onClick={handleGoToDBPM}>Ver BPM</button>
            <button onClick={handleGoToDETA}>Ver ETA</button>
            <button onClick={handleGoToDLUM}>Ver LUM</button>
          </div>

          <div className="pdf-dd-car-buttons">
            <button>
              <a className='btn-pdf-resumenForm' href={pdf.url} target="_blank" rel="noopener noreferrer">
                Ver Auditoria
              </a>
            </button>
            <button className='btn-red' onClick={() => handleDeletePDF(pdf.key)}>Eliminar Auditoria</button>
          </div>
        </div>
      ) : tablaDetails ? (
        <div className='d-flex flex-column'>
          <p>Detalles de la Auditoria encontrados para el requerimiento {numeroRequerimiento}:</p>

          <div className="routes-downloads">
          <button onClick={handleGoToDDetails}>Ver Details</button>
          <button onClick={handleGoToDBPM}>Ver BPM</button>
          <button onClick={handleGoToDETA}>Ver ETA</button>
          <button onClick={handleGoToDLUM}>Ver LUM</button>
          </div>
          <button className='btn-red' onClick={handleDeleteTable}>Borrar Data</button>
        </div>
      ) : (
        <p>No se encontró el PDF ni los detalles de la auditoría.</p>
      )}
    </div>
  );
};

export default ResumenForm;
