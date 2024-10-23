import './InformeEjecutivo.css';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useRef, useEffect, useState } from 'react';
import { getTablaDetailsByNumeroAuditoria } from '../../utils/apiDetails';
import { IEControlCalidad, IECriticalEvaluation, IECriticalFindings, IEEficienciaOp, IEHigiene, IEIndicadoresClave, IESatisfaccion, IESeguridad, IETrazadores } from '../../components';

interface TablaDetail {
  numero_auditoria: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

const InformeEjecutivo: React.FC = () => {
  const [tablaDetails, setTablaDetails] = useState<TablaDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detallesInferioresA100, setDetallesInferioresA100] = useState<TablaDetail[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id, numero_requerimiento } = location.state || {};
  const informeRef = useRef<HTMLDivElement>(null);
  const numeroAuditoria = location.state?.numero_requerimiento;

  const filtrarDetallesInferiorA100 = (tablaDetails: TablaDetail[]): TablaDetail[] => {
    return tablaDetails.filter((detail) => {
      const porcentaje = parseInt(detail.field4);
      return porcentaje < 100;
    });
  };

  useEffect(() => {
    const fetchTablaDetails = async () => {
      if (!numeroAuditoria) {
        console.log("No se encontró número de auditoría");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getTablaDetailsByNumeroAuditoria(numeroAuditoria);
        
        const filtrados = filtrarDetallesInferiorA100(data);
        setDetallesInferioresA100(filtrados);
        setTablaDetails(data);
      } catch (err) {
        console.error('Error al obtener los datos de la tabla:', err);
        setError('Error al obtener los datos de la tabla');
      } finally {
        setLoading(false);
      }
    };

    fetchTablaDetails();
  }, [numeroAuditoria]);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleGoDoc = () => {
    navigate('/documentacion');
  };

  const handleScreenshot = async () => {
    if (!informeRef.current) return;

    await html2canvas(informeRef.current, {
      scale: 2, 
    }).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'InformeEjecutivo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className="InformeEjecutivo-container" ref={informeRef}>
      <h3>Informe Ejecutivo</h3>
      {id && <p>ID: {id}</p>}
      {numero_requerimiento && <p>Auditoria : {numero_requerimiento}</p>}

      <div className="InformeEjecutivo-info">
        <h4> Objetivo General : </h4>
        <p>1.- Mejora continua de sus procesos y productos, lo que se traduce en eficiencia operativa, reducción de costos y un aumento en la satisfacción del  Cliente.</p>
        <h4>Objetivo Especifico :</h4>
        <p>1.	Aseguramiento de la conformidad con estándares y regulaciones :</p>
      
      </div>

      <h5>1.- HALLAZGOS CRITICOS/ACCIONES CORRECTIVAS</h5>
      <IECriticalFindings detallesFiltrados={detallesInferioresA100} />

      <h5>2.- EVALUACIONES CRITICAS</h5>
      <IECriticalEvaluation tablaDetails={tablaDetails} />

      <h5>3. TRAZADORES</h5>
      <IETrazadores tablaDetails={tablaDetails}/>

      <h5>4.- INDICADORES CLAVES DE GESTION</h5>
      <IEIndicadoresClave tablaDetails={tablaDetails}/>

      <h5>5,. HIGIENE INSTALACIONES/ALIMENTOS</h5>
      <IEHigiene tablaDetails={tablaDetails}/>

      <h5>6. EFICIENCIA OPERACIONAL</h5>
      <IEEficienciaOp tablaDetails={tablaDetails}/>

      <h5>7.- SATISFACCION AL CLIENTE</h5>
      <IESatisfaccion tablaDetails={tablaDetails}/>

      <h5>8. SEGURIDAD ALIMENTARIA</h5>
      <IESeguridad tablaDetails={tablaDetails}/>

      <h5>9.- CONTROL DE CALIDAD</h5>
      <IEControlCalidad tablaDetails={tablaDetails}/>

      <div className="ie-buttons">
        <button onClick={handleGoDoc}>volver</button>
        <button className="bg-primary" onClick={handleScreenshot}>Capturar Pantalla</button>
      </div>
    </div>
  );
};

export default InformeEjecutivo;
