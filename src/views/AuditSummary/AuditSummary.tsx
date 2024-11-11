import './AuditSummary.css';
import { AverageModules, BPMGraph, Summary } from '../../components/index';
import { useContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/GlobalState';
import {
  extractPercentage,
  calcularCriticidadConPuntaje,
  calcularDiasRestantesSummary
} from '../../utils/utils';
import { enviarDatosAuditoria, sendEmail } from '../../utils/apiUtils';
import logos from '../../assets/img/index';

const DEFAULT_ANSWER = "Sin respuesta";
const logoFungi = logos.logoBpm;
const logoDetails = logos.logoDetails;
const logoHome = logos.logoHome;
const logoLum = logos.logoLum;
const logoTra = logos.logoTra;

const AuditSummary: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <div>Error: Context is not available.</div>;
  }

  const { state } = context;

  // Estado local para controlar si las incidencias ya fueron enviadas
  const [incidenciasEnviadas, setIncidenciasEnviadas] = useState(false);

  useEffect(() => {
    const handleSendEmail = async () => {
      const { auditSheetData } = state;
      const emailAudit = auditSheetData.auditorEmail;
      const numeroAuditoria = auditSheetData.numeroAuditoria;

      if (!numeroAuditoria) {
        console.error('Error: El número de auditoría es nulo.');
        return;
      }

      if (!emailAudit) {
        console.error('Error: El correo del auditor es nulo.');
        return;
      }

      try {
        await sendEmail(
          emailAudit,
          'Número de Auditoría',
          `Alerta CBPfood Auditoria bpm realizada:
        Se han ingresado nuevas desviaciones correspondientes al número de auditoría: ${numeroAuditoria}.
        Para ver más detalles, haz clic en el siguiente enlace:
        "https://frontend-svc7.onrender.com/"
        `,
        );
      } catch (error) {
        console.error('Error al enviar el correo:', error);
      }
    };

    handleSendEmail();
  }, [state]);

  const handleSendIncidencias = useCallback(async () => {
    if (incidenciasEnviadas) {
      console.log('Las incidencias ya fueron enviadas.');
      return;
    }

    const { auditSheetData, IsHero, photos, authToken } = state;
    const responsableDelProblema = auditSheetData.supervisorEstablecimiento;
  
    if (!authToken) {
      console.error('No se puede enviar desviaciones: el token de autenticación es null.');
      return;
    }
  
    const desviaciones = IsHero
      .filter((hero) => {
        const porcentaje = extractPercentage(hero.answer ?? DEFAULT_ANSWER);
        return porcentaje !== null && porcentaje < 100;
      })
      .map((hero) => {
        
        const nombreDelEstablecimiento = state.auditSheetData.nombreEstablecimiento;
        const photo = photos.find(photo => photo.question === hero.question);
        const numeroAuditoria = state.auditSheetData.numeroAuditoria;
        const auditor = state.userName;
        const email = state.auditSheetData.auditorEmail;
        const criticidad = calcularCriticidadConPuntaje(hero.question ?? DEFAULT_ANSWER);
        const fechaAudit = auditSheetData.fechaAuditoria
        const solucionProgramada = calcularDiasRestantesSummary(fechaAudit , criticidad);
  
        return {
          numeroRequerimiento: numeroAuditoria,
          pregunta: hero.question,
          respuesta: hero.answer ?? DEFAULT_ANSWER,
          fecha: fechaAudit ,
          auditor: auditor,
          nombreEstablecimiento: nombreDelEstablecimiento,
          responsableDelProblema,
          solucionProgramada,
          accionesCorrectivas: '',
          estado: 'Abierto',
          photoUrl: photo ? photo.photoUrl || '' : '',
          email,
          nombreDelEstablecimiento,
          criticidad
        };
      });
  
    try {
      const result = await enviarDatosAuditoria(desviaciones, authToken);
      console.log('Incidencias enviadas exitosamente:', result);
      
      // Marcamos que las incidencias han sido enviadas
      setIncidenciasEnviadas(true);
    } catch (error) {
      console.error('Error al enviar las incidencias:', error);
    }
  }, [state, incidenciasEnviadas]);

  const handleGoToHome = () => {
    navigate('/home');
  };

  const handleGoToLuminometry = () => {
    navigate('/luminometria');
  };

  const handleGoToETA = () => {
    navigate('/seremi');
  };

  const handleGoToDetails = () => {
    navigate('/resumen-detalle');
  };

  const handleNext = async () => {
    await handleSendIncidencias();
    alert('Datos guardados exitosamente');
    handleGoToDetails();
  };

  return (
    <div className="summary-container">
      <div className="logo-fungi">
        <img src={logoFungi} alt="logo" />
      </div>
      <h3 className='fw-bold'>auditoria bpm</h3>
      <Summary />
      <BPMGraph />
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
  );
};

export default AuditSummary;
