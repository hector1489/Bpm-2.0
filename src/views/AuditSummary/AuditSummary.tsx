import './AuditSummary.css'
import html2canvas from 'html2canvas';
import { AverageModules, BPMGraph, Summary } from '../../components/index'
import { useContext, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/GlobalState'
import { extractPercentage, getCurrentDate, calculateSolutionDate, getColorByPercentage } from '../../utils/utils'
import { enviarDatosAuditoria } from '../../utils/apiUtils'
import logos from '../../assets/img/index'
import { pdf } from '@react-pdf/renderer'
import MyDocument from '../../utils/MyDocument'
import { subirPDF } from '../../utils/apiPdfUtils'

const DEFAULT_ANSWER = "Sin respuesta";
const logoFungi = logos.logoBpm;
const logoDetails = logos.logoDetails
const logoHome = logos.logoHome
const logoLum = logos.logoLum
const logoTra = logos.logoTra

const AuditSummary: React.FC = () => {
  const context = useContext(AppContext);
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  const captureSection = async (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      return dataUrl;
    }
    return '';
  };

  const handleCaptureImages = async () => {
    const image1 = await captureSection('.summary-container');

    setImages([image1]);
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

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }));

  const handleSendIncidencias = useCallback(async () => {
    const { auditSheetData, IsHero, photos, authToken } = state;
    const responsableDelProblema = auditSheetData.supervisorEstablecimiento;

    if (!authToken) {
      console.error('No se puede enviar desviaciones: el token de autenticación es null.');
      return;
    }

    const desviaciones = IsHero
      .filter((hero) => extractPercentage(hero.answer ?? DEFAULT_ANSWER) < 100)
      .map((hero) => {
        const criticidadColor = getColorByPercentage(extractPercentage(hero.answer ?? DEFAULT_ANSWER));
        const solucionProgramada = calculateSolutionDate(criticidadColor);
        const nombreDelEstablecimiento = state.auditSheetData.nombreEstablecimiento;
        const photo = photos.find(photo => photo.question === hero.question);
        const numeroAuditoria = state.auditSheetData.numeroAuditoria
        const auditor = state.userName
        const email = state.auditSheetData.auditorEmail

        return {
          numeroRequerimiento: numeroAuditoria,
          pregunta: hero.question,
          respuesta: hero.answer ?? DEFAULT_ANSWER,
          fecha: getCurrentDate(),
          auditor: auditor,
          nombreEstablecimiento: nombreDelEstablecimiento,
          responsableDelProblema,
          solucionProgramada,
          accionesCorrectivas: '',
          estado: 'Abierto',
          photoUrl: photo ? photo.photoUrl || '' : '',
          email
        };
      });

    try {
      const result = await enviarDatosAuditoria(desviaciones, authToken);
      console.log('Incidencias enviadas exitosamente:', result);
    } catch (error) {
      console.error('Error al enviar las incidencias:', error);
    }
  }, [state]);


  const handleGoToHome = () => {
    navigate('/');
  }

  const handleGoToLuminometry = () => {
    navigate('/luminometria')
  }

  const handleGoToETA = () => {
    navigate('/seremi')
  }

  const handleGoToDetails = () => {
    navigate('/resumen-detalle')
  }


  const handleNext = async () => {

    if (images.length > 0) {
      const doc = <MyDocument images={images} />;

      const pdfBlob = await pdf(doc).toBlob();

      const numeroAuditoria = state.auditSheetData.numeroAuditoria || 'sin_numero';

      const pdfFile = new File([pdfBlob], `auditoria_bpm_${numeroAuditoria}_${Date.now()}.pdf`, {
        type: 'application/pdf',
        lastModified: Date.now(),
      });

      try {
        const result = await subirPDF(pdfFile, pdfFile.name);
        await handleSendIncidencias();

        alert('Datos guardados exitosamente');
        console.log('PDF enviado exitosamente:', result);
      } catch (error) {
        console.error('Error al enviar el PDF:', error);
      }
    }

    handleGoToDetails();    
  }



  return (
    <div className="summary-container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3 className='fw-bold'>auditoria bpm</h3>
      <Summary />
      <BPMGraph moduleData={moduleData} />
      <AverageModules />

      <div className="buttons-summary-circle">

        <button onClick={handleNext}>
          Siguiente <i className="fa-solid fa-arrow-right"></i>
        </button>

      </div>

      <div className="buttons-summary-logo">
        <div className="btn">
          <img src={logoDetails} alt="details" onClick={handleGoToDetails} title='Details' />
        </div>
        <div className="btn">
          <img src={logoLum} alt="lum" onClick={handleGoToLuminometry} title='LUM' />
        </div>
        <div className="btn">
          <img src={logoTra} alt="tra" onClick={handleGoToETA} title='TRA' />
        </div>
        <div className="btn">
          <img src={logoHome} alt="home" onClick={handleGoToHome} title='Home' />
        </div>

      </div>



    </div>
  )
}

export default AuditSummary
