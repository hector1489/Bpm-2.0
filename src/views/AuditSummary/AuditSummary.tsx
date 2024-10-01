import { useNavigate } from 'react-router-dom'
import './AuditSummary.css'
import { AverageModules, BPMGraph, Summary } from '../../components/index'
import { useContext, useCallback } from 'react'
import { AppContext } from '../../context/GlobalState'
import { extractPercentage, getCurrentDate, calculateSolutionDate, getColorByPercentage } from '../../utils/utils'
import { enviarDatosAuditoria } from '../../utils/apiUtils'

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
        const email = state.auditSheetData.auditorEmail
  
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

  return (
    <div className="summary-container">
      <h3>Resumen</h3>
      <Summary />
      <BPMGraph moduleData={moduleData} />
      <AverageModules />
      <div className="buttons-summary">
        <button onClick={handleSendIncidencias}>Enviar Incidencias</button>
        <button onClick={handleGoToDetails}>detalle</button>
        <button onClick={handleGoToLuminometry}>Luminometria</button>
        <button onClick={handleGoToETA}>ETA</button>
        <button onClick={handleGoToHome}>Home</button>
      </div>
    </div>
  )
}

export default AuditSummary
