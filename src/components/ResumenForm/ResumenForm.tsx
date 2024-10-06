import './ResumenForm.css';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { obtenerPDFs } from '../../utils/apiPdfUtils';

interface PDFData {
  key: string;
  url: string;
}

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  const [pdfs, setPdfs] = useState<PDFData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  if (!context) {
    return <div>Error al cargar el contexto</div>;
  }

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

  useEffect(() => {
    fetchPDFs();
  }, []);

  return (
    <div className="Resumen-form-container">
      {loading ? (
        <p>Cargando PDFs...</p>
      ) : (
        <div className="pdf-card-container">
          {pdfs.map((pdf) => (
            <div key={pdf.key} className="pdf-card">
              <h3>PDF: {pdf.key}</h3>
              <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                Ver PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumenForm;
