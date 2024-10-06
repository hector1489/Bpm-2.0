import './ResumenForm.css';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { obtenerPDFs, eliminarPDF } from '../../utils/apiPdfUtils';

interface PDFData {
  key: string;
  url: string;
}

const ResumenForm: React.FC = () => {
  const context = useContext(AppContext);
  const [pdfs, setPdfs] = useState<PDFData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleDeletePDF = async (key: string) => {
    try {
      await eliminarPDF(key);
      setPdfs(pdfs.filter(pdf => pdf.key !== key));
    } catch (error) {
      console.error('Error al eliminar el PDF:', error);
    }
  };

  const indexOfLastPDF = currentPage * itemsPerPage;
  const indexOfFirstPDF = indexOfLastPDF - itemsPerPage;
  const currentPDFs = pdfs.slice(indexOfFirstPDF, indexOfLastPDF);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(pdfs.length / itemsPerPage)) {
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
            {currentPDFs.map((pdf) => (
              <div key={pdf.key} className="pdf-card">
                <p>PDF: {pdf.key}</p>
                <div className="pdf-dd-car-buttons">
                  <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                    Ver PDF
                  </a>
                  <button className='btn-red' onClick={() => handleDeletePDF(pdf.key)}>Eliminar PDF</button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>Página {currentPage} de {Math.ceil(pdfs.length / itemsPerPage)}</span>
            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(pdfs.length / itemsPerPage)}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResumenForm;
