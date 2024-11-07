import './ResumenForm.css';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import { obtenerPDFs, eliminarPDF } from '../../utils/apiPdfUtils';
import { deleteTablaDetail, getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { getAuditSheetByUsername, deleteAuditSheetById } from '../../utils/apiAuditSheet';

interface PDFData {
  key: string;
  url: string;
}

interface TablaDetail {
  id: number;
  numero_requerimiento: string;
}

interface AuditSheet {
  id: string;
  username: string;
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
}

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [pdf, setPdf] = useState<PDFData | null>(null);
  const [tablaDetails, setTablaDetails] = useState<TablaDetail | null>(null);
  const [auditSheetDetails, setAuditSheetDetails] = useState<AuditSheet[] | null>(null);
  const [filteredAuditSheet, setFilteredAuditSheet] = useState<AuditSheet | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

  const { state } = context;

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

  const handleGoToDoc = () => {
    navigate('/documentacion');
  };

  const fetchTablaDetails = async () => {
    if (numeroRequerimiento) {
      try {
        const response: any[] = await getTablaDetailsByNumeroAuditoria(numeroRequerimiento);

        setTablaDetails(response.length > 0 ? response[0] : null);
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

  const handleGoToKPI = () => {

    navigate('/kpi', {
      state: { numero_requerimiento: numeroRequerimiento, userName: state.userName },
    });
  }



  const fetchAuditSheetDetails = async () => {
    const username = state?.userName;
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const auditSheetData = await getAuditSheetByUsername(username);
      setAuditSheetDetails(auditSheetData);
    } catch (err) {
      setError('Error al obtener los datos del audit sheet');
    } finally {
      setLoading(false);
    }
  };

  const numeroAuditoria = numeroRequerimiento;
  // useEffect para filtrar los datos por numero de auditoría
  const bpmFilteredAuditSheet = () => {

    if (numeroAuditoria && auditSheetDetails) {
      const filteredData = auditSheetDetails.find(
        (sheet) => sheet.numero_auditoria === numeroAuditoria
      );
      setFilteredAuditSheet(filteredData || null);
    }
  };

  useEffect(() => {
    fetchAuditSheetDetails();
  }, [context?.state?.userName]);

  useEffect(() => {
    bpmFilteredAuditSheet();
  }, [auditSheetDetails, numeroAuditoria]);


  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!filteredAuditSheet) {
    return <p>No se encontraron detalles para la auditoría {numeroAuditoria}</p>;
  }

  const handleDeleteTable = async () => {
    try {
      if (numeroRequerimiento) {
        await deleteTablaDetail(numeroRequerimiento);
        console.log(`Detalles de la auditoría ${numeroRequerimiento} eliminados correctamente.`);

        if (filteredAuditSheet) {
          await deleteAuditSheetById(filteredAuditSheet.id);
          console.log(`Registro audit_sheet con id ${filteredAuditSheet.id} eliminado correctamente.`);
        } else {
          console.warn('No se pudo eliminar el registro audit_sheet: ID no encontrado.');
        }
      } else {
        console.warn('No se pudo eliminar los detalles de la tabla: número de auditoría no disponible.');
      }
    } catch (error) {
      console.error('Error al eliminar los detalles de la tabla o audit_sheet:', error);
    }

    handleGoToDoc();
  };



  return (
    <div className="Resumen-form-container">
      {loading ? (
        <p>Cargando la Base de Datos...</p>
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
          <p>Detalles de la Auditoria : {numeroRequerimiento}</p>

          <div className="routes-downloads">
            <button onClick={handleGoToDDetails}>Ver Details</button>
            <button onClick={handleGoToDBPM}>Ver BPM</button>
            <button onClick={handleGoToDETA}>Ver ETA</button>
            <button onClick={handleGoToDLUM}>Ver LUM</button>
            <button onClick={handleGoToKPI}>Ver KPI</button>
          </div>
          
          <div className='d-flex justify-content-around gap-2'>
            <button className='btn-red' onClick={handleDeleteTable}>Borrar Data</button>
            <button onClick={handleGoToDoc}>volver</button>
          </div>

        </div>
      ) : (
        <p>No se encontró datos para la auditoría.</p>
      )}
    </div>
  );
};

export default ResumenForm;



