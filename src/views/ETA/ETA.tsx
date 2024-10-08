import { ETAGraph, ETATable } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import './ETA.css';
import html2canvas from 'html2canvas';
import { pdf } from '@react-pdf/renderer';
import MyDocument from '../../utils/MyDocument';
import { subirPDF } from '../../utils/apiPdfUtils';
import logos from '../../assets/img/index'

const logoDetails = logos.logoDetails
const logoHome = logos.logoHome
const logoLum = logos.logoLum


const ETA: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [images, setImages] = useState<string[]>([]);

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const handleCaptureImages = async () => {
    const element = document.querySelector('.eta-container') as HTMLElement;
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
  }

  const numeroAuditoria = state.auditSheetData.numeroAuditoria || 'sin_numero';

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
    navigate('/luminometria')
  }

  const handleNext = async () => {
    if (images.length > 0) {
      const doc = <MyDocument images={images} />;

      const pdfBlob = await pdf(doc).toBlob();
      const pdfFile = new File([pdfBlob], `eta_resumen_${numeroAuditoria}_${Date.now()}.pdf`, {
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

    handleGoToHome();
  }


  return (
    <div className="eta-container">
      <h3>Resumen ETA</h3>
      <ETAGraph moduleData={state.modules.map(module => ({
        moduleName: module.module,
        percentage: calculatePercentage(module.id),
      }))} />
      <ETATable />

      <div className="detail-button">
        <button onClick={handleNext}>
          Siguiente <i className="fa-solid fa-arrow-right"></i>
        </button>

      </div>


      <div className="buttons-summary-logo">
        <div className="btn" onClick={handleGoToAuditSummary} title='Volver'>
          <i className="fa-solid fa-arrow-left" ></i>
        </div>
        <div className="btn">
          <img src={logoDetails} alt="details" onClick={handleGoToDetails} title='Details' />
        </div>
        <div className="btn">
          <img src={logoLum} alt="lum" onClick={handleGoToLuminometry} title='LUM' />
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home' />
        </div>

      </div>
    </div>
  );
};

export default ETA;
