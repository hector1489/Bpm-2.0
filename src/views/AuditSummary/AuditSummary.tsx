import { useNavigate } from 'react-router-dom';
import './AuditSummary.css';
import { AverageModules, BPMGraph, Summary } from '../../components/index';
import { useContext, useCallback } from 'react';
import { AppContext } from '../../context/GlobalState';
import { extractPercentage, getCurrentDate, calculateSolutionDate, getColorByPercentage } from '../../utils/utils';
import { enviarDatosAuditoria,  crearDetalleTabla  } from '../../utils/apiUtils';

const DEFAULT_ANSWER = "Sin respuesta";

const AuditSummary: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(AppContext);

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
  }

  const moduleData = state.modules.map((module) => ({
    moduleName: module.module,
    percentage: calculatePercentage(module.id),
  }));

  const handleSendIncidencias = useCallback(async () => {
    const { auditSheetData, IsHero, photos, authToken } = state;
   // const email = auditSheetData.auditorEmail;
    const nombreEstablecimiento = auditSheetData.nombreEstablecimiento;
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
        const photo = photos.find(photo => photo.question === hero.question);
        const numeroAuditoria = state.auditSheetData.numeroAuditoria
        const auditor = state.userName
  
        return {
          numeroRequerimiento: numeroAuditoria,
          pregunta: hero.question,
          respuesta: hero.answer ?? DEFAULT_ANSWER,
          fecha: getCurrentDate(),
          auditor: auditor,
          nombreEstablecimiento,
          responsableDelProblema,
          solucionProgramada,
          accionesCorrectivas: '',
          estado: 'Abierto',
          photoUrl: photo ? photo.photoUrl || '' : ''
        };
      });
  
    try {
      const result = await enviarDatosAuditoria(desviaciones, authToken);
      console.log('Incidencias enviadas exitosamente:', result);
    } catch (error) {
      console.error('Error al enviar las incidencias:', error);
    }
  }, [state]);

  

  const handleSendDetails = async () => {
    const authToken = state.authToken || 'defaultAuthToken';
    for (const question of state.IsHero) {

      const currentModule = state.modules.find(module => {
        if (!module.question) {
          return false;
        }
  
        const moduleQuestions = Array.isArray(module.question) ? module.question : [module.question];
        const questionText = Array.isArray(question.question) ? question.question.join(' ') : question.question;
  
        return moduleQuestions.some(q => questionText.includes(q));
      });
  
      if (!currentModule) {
        console.error('No se encontró el módulo actual.');
        continue;
      }
  
      const detalle = {
        columna1: String(question.id) || 'Default ID',
        columna2: currentModule.module || 'Unknown Module',
        columna3: question.question,
        columna4: question.answer ?? DEFAULT_ANSWER,
      };
  
      try {
        const nuevoDetalle = await crearDetalleTabla(detalle.columna1, detalle.columna2, detalle.columna3, detalle.columna4, authToken);
        console.log('Detalle creado:', nuevoDetalle);
      } catch (error) {
        console.error('Error al enviar el detalle:', error);
      }
    }
  };
  
  
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

  return (
    <div className="summary-container">
      <h3>Resumen</h3>
      <Summary />
      <BPMGraph moduleData={moduleData} />
      <AverageModules />
      <div className="buttons-summary">
        <button onClick={handleSendIncidencias}>Enviar Incidencias</button>
        <button onClick={handleSendDetails}>Enviar Detalle</button>
        <button onClick={handleGoToDetails}>detalle</button>
        <button onClick={handleGoToLuminometry}>Luminometria</button>
        <button onClick={handleGoToETA}>ETA</button>
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  );
}

export default AuditSummary;
