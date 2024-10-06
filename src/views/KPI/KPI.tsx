import { KPIGraph, KPITable } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import './KPI.css';
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
import MyDocument from '../../utils/MyDocument';
import { subirPDF } from '../../utils/apiPdfUtils';

const KPI: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [images, setImages] = useState<string[]>([]);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const calculatePercentage = (moduleId: number): number => {
    try {
      const moduleQuestions = state.IsHero.filter(question => question.id === moduleId);
      const totalQuestions = moduleQuestions.length;

      if (totalQuestions === 0) {
        return 100;
      }

      const totalPercentage = moduleQuestions.reduce((acc, question) => {
        if (question.answer && typeof question.answer === 'string') {
          const match = question.answer.match(/(\d+)%/);
          const percentage = match ? parseInt(match[1], 10) : 0;
          return acc + percentage;
        } else {
          return acc;
        }
      }, 0);

      return totalPercentage / totalQuestions;
    } catch (error) {
      console.error('Error calculating percentage for module:', moduleId, error);
      return 100;
    }
  };

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }));

  // Función para capturar la imagen de la sección KPI
  const handleCaptureImages = async () => {
    const element = document.querySelector('.kpi-container') as HTMLElement;
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      setImages([dataUrl]);
    }
  };

  useEffect(() => {
    handleCaptureImages(); // Captura la imagen cuando el componente se monta
  }, []);

  // Función para enviar el PDF al backend
  const handleSendPDF = async () => {
    if (images.length > 0) {
      const doc = <MyDocument images={images} />; // Genera el PDF con las imágenes capturadas

      const pdfBlob = await pdf(doc).toBlob();
      const pdfFile = new File([pdfBlob], `kpi_resumen_${Date.now()}.pdf`, {
        type: 'application/pdf',
        lastModified: Date.now(),
      });

      try {
        const result = await subirPDF(pdfFile, pdfFile.name); // Sube el PDF al backend
        alert('PDF enviado exitosamente');
        console.log('PDF enviado exitosamente:', result);
      } catch (error) {
        console.error('Error al enviar el PDF:', error);
      }
    }
  };

  // Funciones de navegación
  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToDetails = () => {
    navigate('/resumen-detalle');
  };

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  };

  const handleGoToETA = () => {
    navigate('/seremi');
  };

  return (
    <div className="kpi-container">
      <h3>Resumen KPI</h3>
      <KPIGraph moduleData={moduleData} />
      <KPITable />
      <div className="buttons-luminometry">
        <button className='btn-circle btn-green' onClick={handleGoToAuditSummary}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToDetails} title='Detalle'>
          <i className="fa-solid fa-circle-info"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToLuminometry} title='Luminometria'>
          <i className="fa-regular fa-lightbulb"></i>
        </button>
        <button className='btn-circle bg-warning' onClick={handleGoToETA} title='ETA'>
          <i className="fa-solid fa-e"></i>
        </button>
        <button className='btn-circle' onClick={handleGoToHome}>
          <i className="fa-solid fa-house-chimney"></i>
        </button>

        {images.length > 0 && (
          <button onClick={handleSendPDF} className="btn-dd-pdf">
            Enviar PDF <i className="fa-solid fa-upload"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default KPI;
