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

  const handleCaptureImages = async () => {
    const element = document.querySelector('.kpi-container') as HTMLElement;
    if (element) {
      setTimeout(async () => {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      setImages([dataUrl]);
    }, 1000);
    }
  };

  useEffect(() => {
    handleCaptureImages();
  }, []);

  const numeroAuditoria = state.auditSheetData.numeroAuditoria || 'sin_numero';

  const handleSendPDF = async () => {
    if (images.length > 0) {
      const doc = <MyDocument images={images} />;

      const pdfBlob = await pdf(doc).toBlob();
      const pdfFile = new File([pdfBlob], `kpi_resumen_${numeroAuditoria}_${Date.now()}.pdf`, {
        type: 'application/pdf',
        lastModified: Date.now(),
      });

      try {
        const result = await subirPDF(pdfFile, pdfFile.name);
        alert('PDF enviado exitosamente');
        console.log('PDF enviado exitosamente:', result);
      } catch (error) {
        console.error('Error al enviar el PDF:', error);
      }
    }
  };

  const handleGoToAuditSummary = () => {
    navigate('/resumen-auditoria');
  };

  const handleGoToHome = () => {
    navigate('/home');
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
        <button className='btn-circle btn-blue' onClick={handleGoToDetails} title='Detalle'>
          DTLS
        </button>
        <button className='btn-circle btn-blue' onClick={handleGoToLuminometry} title='Luminometria'>
          LUM
        </button>
        <button className='btn-circle btn-blue' onClick={handleGoToETA} title='ETA'>
          ETA
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
